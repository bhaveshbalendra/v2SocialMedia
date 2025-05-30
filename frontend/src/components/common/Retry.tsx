import { Icons } from "../export/Icons";

type RetryProps = {
  onClick: () => void;
};

const Retry = ({ onClick }: RetryProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 rounded border px-3 py-1 text-red-500 hover:bg-red-100"
  >
    Retry
    <Icons.Refresh />
  </button>
);

export default Retry;
