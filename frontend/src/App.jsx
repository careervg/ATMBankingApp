import { AtmMachine } from "./components/AtmMachine.jsx";
import { useAtm } from "./hooks/useAtm.js";

export default function App() {
  const atm = useAtm();
  return <AtmMachine atm={atm} />;
}
