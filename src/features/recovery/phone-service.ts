export async function sendRecoveryPhoneOtp(input: {
  phone: string;
  code: string;
}) {
  return {
    delivered: true,
    channel: "phone",
    developmentCode: process.env.NODE_ENV === "development" ? input.code : undefined,
  };
}
