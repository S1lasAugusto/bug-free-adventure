import React from "react";
import { Trophy, Medal, Award, Star } from "lucide-react";

const LeaderboardPreview = () => {
  const leaderboard = [
    {
      userId: "1",
      name: "Joe",
      score: 100,
    },
    {
      userId: "2",
      name: "Ola",
      score: 90,
    },
    {
      userId: "3",
      name: "Me",
      score: 80,
    },
    {
      userId: "4",
      name: "Jane",
      score: 70,
    },
    {
      userId: "5",
      name: "John",
      score: 60,
    },
  ];

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
            {position}
          </span>
        );
    }
  };

  const getRankBg = (position: number, isMe: boolean) => {
    if (isMe) return "bg-blue-50 border-l-4 border-blue-500";
    if (position === 1) return "bg-gradient-to-r from-yellow-50 to-yellow-100";
    if (position === 2) return "bg-gradient-to-r from-gray-50 to-gray-100";
    if (position === 3) return "bg-gradient-to-r from-amber-50 to-amber-100";
    return "bg-white hover:bg-gray-50";
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          <span className="font-semibold text-gray-800">Leaderboard</span>
        </div>
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
          Java
        </span>
      </div>

      {/* Leaderboard List */}
      <div className="p-2">
        {leaderboard.slice(0, 5).map((person, index) => {
          const position = index + 1;
          const isMe = person.name === "Me";

          return (
            <div
              key={person.userId}
              className={`mb-1 flex items-center justify-between rounded-lg p-3 transition-colors ${getRankBg(
                position,
                isMe
              )}`}
            >
              <div className="flex items-center gap-3">
                {getRankIcon(position)}
                <span
                  className={`text-sm font-medium ${
                    isMe ? "text-blue-700" : "text-gray-700"
                  }`}
                >
                  {person.name}
                  {isMe && (
                    <span className="ml-1 text-xs text-blue-500">(You)</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold ${
                    isMe ? "text-blue-700" : "text-gray-600"
                  }`}
                >
                  {person.score}
                </span>
                <span className="text-xs text-gray-400">pts</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-3">
        <div className="text-center text-xs text-gray-500">
          Your current rank:{" "}
          <span className="font-semibold text-gray-700">#3</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPreview;
