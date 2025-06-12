import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { Trophy, Medal, Award, Star } from "lucide-react";

const Leaderboard = () => {
  const { user, isLoading: authLoading } = useAuth();

  const {
    data: leaderboard,
    isLoading,
    isSuccess,
  } = api.userRouter.getLeaderBoard.useQuery();

  if (!isSuccess || isLoading) {
    return (
      <div className="mx-auto w-full rounded-md p-4">
        <div className="flex animate-pulse space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="loading mt-6 h-60 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return <div>Loading...</div>;
  }

  const leaderboardTop10 = leaderboard.slice(0, 10);
  const leaderboardPosition =
    leaderboard.findIndex((x) => x.userId === user?.id) + 1;
  const userScore = leaderboard[leaderboardPosition - 1]?.score;

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return <Star className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRankBg = (position: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return "bg-blue-50 border-l-4 border-blue-500 shadow-md";
    }
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100";
      default:
        return "bg-white hover:bg-gray-50";
    }
  };

  return (
    <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-bold text-gray-800">Leaderboard</span>
        </div>
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
          Java
        </span>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2 p-4">
        {leaderboardTop10.map((person, index) => {
          const position = index + 1;
          const isCurrentUser = person.userId === user?.id;

          return (
            <div
              key={person.userId}
              className={`flex items-center justify-between rounded-lg p-3 transition-all duration-200 ${getRankBg(
                position,
                isCurrentUser
              )}`}
            >
              {/* Left side - Rank and name */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                  {getRankIcon(position)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {person.name}
                      {isCurrentUser && (
                        <span className="ml-1 text-xs font-semibold text-blue-600">
                          (You)
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">#{position}</span>
                </div>
              </div>

              {/* Right side - Score */}
              <div className="text-right">
                <div className="font-bold text-gray-900">{person.score}</div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          );
        })}

        {/* Show current user if not in top 10 */}
        {!leaderboardTop10.some((e) => e.userId === user?.id) && (
          <>
            <div className="my-2 border-t border-gray-200 pt-2">
              <div className="mb-2 text-center text-xs text-gray-500">...</div>
            </div>
            <div className="flex items-center justify-between rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                  <Star className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {user?.name || "Unknown"}
                      <span className="ml-1 text-xs font-semibold text-blue-600">
                        (You)
                      </span>
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    #{leaderboardPosition}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{userScore}</div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="rounded-b-lg border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="text-sm text-gray-600">
          Your current rank:{" "}
          <span className="font-semibold text-gray-900">
            #{leaderboardPosition || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
