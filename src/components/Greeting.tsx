import { useAuth } from "../contexts/AuthContext";

const Greeting = () => {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <p className="text-lg font-bold text-gray-900 dark:text-white">
        {user?.name}!
      </p>
    </div>
  );
};

export default Greeting;
