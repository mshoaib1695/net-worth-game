"use client";
import { getAuthToken, useDynamicContext } from "../lib/dynamic";
import { useRouter } from "next/navigation";
import Navbar from "../components/shared/Navbar";
import RankingsTable from "../components/shared/RankingsTable";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useDynamicContext();
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      getLeaderBoardData();
    }
  }, [user, router]);

  const getLeaderBoardData = async () => {
    const dynamicJwtToken = getAuthToken();
    try {
      const resp = await fetch("/api/leaderboard", {
        headers: {
          Authorization: `Bearer ${dynamicJwtToken}`,
        },
      });
      const data = await resp.json();
      setUsers(data.data);
    } catch (e) {
      console.log(e);
      setUsers([]);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container  px-4">
        <RankingsTable users={users} />
      </div>
    </>
  );
}
