import tg from "../utils/tg";
import { useUserStore } from "../store/useUserStore";

const getReferralLink = (): string => {
  const user = useUserStore.getState().user;

  const userId = user?.id;

  if (!userId) {
    return `https://t.me/misapatStage_bot?startapp=refId0`; // или другой дефолтный ID
  }

  const referralLink = `https://t.me/misapatStage_bot?startapp=refId${userId}`;

  return referralLink;
};

export default getReferralLink;
