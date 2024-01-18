import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import { Account, account, totp } from "./db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export const authenticator = new Authenticator<Account>(sessionStorage, {
  throwOnError: true,
});

export const requireUser = async (request: Request) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
};

const codeStrategy = new FormStrategy(async ({ form }) => {
  //TODO: code should be encrypted and salted probably?
  const code = form.get("code") as string;
  console.log("code:", code);

  if (!code) {
    throw new AuthorizationError(`Введите код в поле выше`);
  }

  const result = await db.transaction(async (tx) => {
    const existingCode = await tx.query.totp.findFirst({
      where: eq(totp.code, code),
    });

    if (!existingCode) {
      console.error(`Unable to find provided code in the database ${code}`);
      throw new AuthorizationError("Невалидный код, получите новый");
    }

    const accountInfo = {
      firstName: existingCode.telegramUser?.first_name,
      lastName: existingCode.telegramUser?.last_name,
    };

    const telegramId = existingCode.telegramId;

    const ensured = await tx
      .insert(account)
      .values({
        telegramId,
        ...accountInfo,
        createdAt: new Date(),
      })
      .onConflictDoUpdate({
        target: account.telegramId,
        set: { ...accountInfo },
      })
      .returning();
    await tx.update(totp).set({ wasUsed: true }).where(eq(totp.code, code));
    return ensured;
  });

  return result[0];
});

authenticator.use(codeStrategy, "code");
