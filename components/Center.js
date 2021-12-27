import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";

import { shuffle } from "lodash";
import { useState, useEffect } from "react";

const colors = [
  "from indigo-500",
  "from-green-500",
  "from-orange-500",
  "from-purple-500",
  "from-red-500",
  "from-teal-500",
];

function Center() {
  const { data: session } = useSession();

  const [color, setColor] = useState(null);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);

  return (
    <div className="flex-grow text-white">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
          ></img>
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5"></ChevronDownIcon>
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        {/* <img></img> */}
        <h1>hello</h1>
      </section>
    </div>
  );
}

export default Center;
