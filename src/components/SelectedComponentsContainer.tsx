import HistoryGraph from "./HistoryGraph";
import ExerciseHistory from "./home/ExerciseHistory";
import Leaderboard from "./Leaderboard";
import { SelectedEnum } from "@prisma/client";
import ToDoComp from "./todo/ToDoComp";
import CourseCard from "./CourseCard";
import Stats from "./Stats";
import Regula from "./Regula";

interface ISelectedComponentsProps {
  selected: Array<SelectedEnum>;
  leaderboard: boolean;
}

const SelectedComponentsContainer = (props: ISelectedComponentsProps) => {
  const { selected, leaderboard } = props;

  const components: { [key: string]: React.ReactElement } = {
    HISTORYGRAPH: (
      <div>
        <div className="text-color mb-6 text-xl font-semibold uppercase opacity-75">
          activity graph
        </div>
        <HistoryGraph />
      </div>
    ),
    STATS: (
      <div>
        <div className="text-color mb-6 text-xl font-semibold uppercase opacity-75">
          stats
        </div>
        <Stats />
      </div>
    ),
    LEADERBOARD: (
      <div>
        <div className="text-color text-xl font-semibold uppercase opacity-75">
          leaderboard
        </div>
        <Leaderboard />
      </div>
    ),
    TODO: (
      <div>
        <div className="text-color mb-6  text-xl font-semibold uppercase opacity-75">
          Exercise Planner
        </div>
        <ToDoComp />
      </div>
    ),
    EXERCISEHISTORY: (
      <div>
        <div className="text-color mb-6 text-xl font-semibold uppercase opacity-75">
          history
        </div>
        <ExerciseHistory />
      </div>
    ),
    REGULA: (
      <div>
        <div className="text-color mb-6 text-xl font-semibold uppercase opacity-75">
          regula
        </div>
        <Regula />
      </div>
    ),
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-16 gap-y-8">
        <div>
          <p className="text-color mb-6 text-xl font-semibold uppercase opacity-75">
            My courses
          </p>
          <div className="flex">
            <CourseCard courseName="java" />
          </div>
        </div>
        {leaderboard && <div>{components["LEADERBOARD"]}</div>}
        {selected.map((compEnum: string) => (
          <div key={compEnum}>{components[compEnum]}</div>
        ))}
      </div>
    </div>
  );
};

export default SelectedComponentsContainer;
