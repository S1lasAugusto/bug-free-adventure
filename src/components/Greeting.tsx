import { useAuth } from "../contexts/AuthContext";

const Greeting = () => {
  const { user } = useAuth();
  return <div className="text-color rounded text-3xl">Hey, {user?.name}!</div>;
};

export default Greeting;
