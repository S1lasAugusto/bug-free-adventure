import { Disclosure } from "@headlessui/react";

import { trpc } from "../utils/trpc";
import { ChartBarIcon, FolderIcon } from "@heroicons/react/24/outline";
import Greeting from "./Greeting";
import ToggleTheme from "./ToggleTheme";
import { useRouter } from "next/router";
import Image from "next/image";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar2 = ({ children }: { children: React.ReactElement }) => {
  const router = useRouter();
  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: ChartBarIcon,
      current: router.asPath === "/dashboard",
    },
    {
      name: "Courses",
      icon: FolderIcon,
      current: router.asPath === "/courses",
      children: [
        { name: "Java", href: "/courses" },
        { name: "Python", href: "/courses" },
      ],
    },
  ];

  const {
    data: learnerAnalytics,
    isSuccess,
    isLoading,
  } = trpc.useQuery(["learneractivity.getLearnerActivity"]);

  return (
    <>
      <div>
        <div className="hidden md:fixed md:inset-y-0 md:m-4 md:flex md:h-full md:w-64 md:flex-col">
          <div className="flex flex-grow flex-col overflow-y-auto rounded-l-lg border-r bg-white pt-8 md:h-full">
            <div className="flex flex-shrink-0 justify-center px-4">
              <Greeting />
            </div>
            <div className="mt-5 flex flex-grow flex-col">
              <nav
                className="flex-1 space-y-1 bg-white px-2"
                aria-label="Sidebar"
              >
                {navigation.map((item) =>
                  !item.children ? (
                    <div key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-100 text-gray-900"
                            : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group flex w-full items-center rounded-md py-2 pl-2 text-sm font-medium"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-3 h-6 w-6 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </div>
                  ) : (
                    <Disclosure as="div" key={item.name} className="space-y-1">
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={classNames(
                              item.current
                                ? "bg-gray-100 text-gray-900"
                                : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                              "group flex w-full items-center rounded-md py-2 pl-2 pr-1 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            )}
                          >
                            <item.icon
                              className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                            <span className="flex-1">{item.name}</span>
                            <svg
                              className={classNames(
                                open
                                  ? "rotate-90 text-gray-400"
                                  : "text-gray-300",
                                "ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400"
                              )}
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path
                                d="M6 6L14 10L6 14V6Z"
                                fill="currentColor"
                              />
                            </svg>
                          </Disclosure.Button>
                          <Disclosure.Panel className="space-y-1">
                            {item.children.map((subItem) => (
                              <Disclosure.Button
                                key={subItem.name}
                                as="a"
                                href={subItem.href}
                                className="group flex w-full items-center rounded-md py-2 pl-11 pr-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              >
                                {subItem.name}
                              </Disclosure.Button>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )
                )}
              </nav>
            </div>

            <div className="mb-4 flex flex-shrink-0 border-t border-gray-200 p-4">
              <a href="#" className="group block w-full flex-shrink-0">
                <div className="flex items-center">
                  <div className="ml-3">
                    {isLoading || !isSuccess ? (
                      <div className="flex items-center justify-center">
                        <div
                          className="spinner-border inline-block h-6 w-6 animate-spin rounded-full border-4 text-gray-300"
                          role="status"
                        ></div>
                      </div>
                    ) : (
                      <div className="text-color">
                        {learnerAnalytics.learner.id}
                      </div>
                    )}
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                      View profile
                    </p>
                  </div>
                  <div className="ml-8">
                    <ToggleTheme />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-60">
          <main className="flex-1 ">
            <div className="py-4">
              <div className="h-screen px-4">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Sidebar2;
