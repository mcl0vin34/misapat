import tg from "../utils/tg";

const getReferralLink = (): string => {
  const { initDataUnsafe } = tg;
  const userId = initDataUnsafe.user?.id;

  const referralLink = `https://t.me/SimaTap?startapp=refId${userId}`;

  return referralLink;
};

export default getReferralLink;
