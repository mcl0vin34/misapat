import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../Layout/Layout";
import Main from "../pages/MainPage/MainPage";
import FriendsList from "../pages/FriendsInvitePage/FriendsInvitePage";
import Quests from "../pages/QuestsPage/QuestsPage";
import Leveling from "../pages/LevelingPage/LevelingPage";
import Shop from "../pages/ShopPage/ShopPage";
import LeaderBoard from "../pages/LeaderBoardPage/LeaderBoardPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />} />
        <Route path="friendslist" element={<FriendsList />} />
        <Route path="quests" element={<Quests />} />
        <Route path="leveling" element={<Leveling />} />
        <Route path="shop" element={<Shop />} />
        <Route path="leaderboard" element={<LeaderBoard />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
