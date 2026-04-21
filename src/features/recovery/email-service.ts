export async function sendRecoveryEmailChallenge(input: {
  email: string;
  code: string;
}) {
  return {
    delivered: true,
    channel: "email",
    developmentCode: process.env.NODE_ENV === "development" ? input.code : undefined,
  };
}
