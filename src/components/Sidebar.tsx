import { Disclosure } from "@headlessui/react";
import {
  HomeIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  CommandLineIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import ToggleTheme from "./ToggleTheme";
import UIOnboarding from "./onboarding/UIOnboarding";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = ({ children }: { children: React.ReactElement }) => {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      current: router.asPath === "/",
    },
    {
      name: "Courses",
      icon: BookOpenIcon,
      iconSolid: BookOpenIconSolid,
      current: router.asPath.startsWith("/courses"),
      children: [
        { name: "Java", href: "/courses/Java", icon: CommandLineIcon },
      ],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Cog6ToothIcon,
      iconSolid: Cog6ToothIconSolid,
      current: router.asPath === "/settings",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-64 bg-white shadow-xl dark:bg-gray-800">
          <div className="flex h-full flex-col">
            {/* Logo skeleton */}
            <div className="flex h-20 items-center justify-center border-b border-gray-200 dark:border-gray-700">
              <div className="h-20 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Navigation skeleton */}
            <div className="flex-1 space-y-2 px-4">
              <div className="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="flex h-20 items-center justify-end px-6">
            <ToggleTheme />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div>
        {user?.onBoarded ? (
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-xl dark:bg-gray-800">
              <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-20 items-center justify-center border-b border-gray-200 px-6 dark:border-gray-700">
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={80}
                    height={80}
                    className="h-20 w-auto"
                  />
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-4 pb-4">
                  {navigation.map((item) =>
                    !item.children ? (
                      <Link key={item.name} href={item.href || "#"}>
                        <div
                          className={classNames(
                            item.current
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                            "group flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
                          )}
                        >
                          {item.current ? (
                            <item.iconSolid className="mr-3 h-5 w-5 flex-shrink-0" />
                          ) : (
                            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                          )}
                          {item.name}
                        </div>
                      </Link>
                    ) : (
                      <Disclosure
                        as="div"
                        key={item.name}
                        className="space-y-1"
                      >
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={classNames(
                                item.current
                                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                                "group flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                              )}
                            >
                              {item.current ? (
                                <item.iconSolid className="mr-3 h-5 w-5 flex-shrink-0" />
                              ) : (
                                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                              )}
                              <span className="flex-1">{item.name}</span>
                              <ChevronRightIcon
                                className={classNames(
                                  open ? "rotate-90" : "",
                                  "ml-3 h-4 w-4 flex-shrink-0 transform transition-transform duration-200"
                                )}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="space-y-1">
                              {item.children.map((subItem) => (
                                <Link key={subItem.name} href={subItem.href}>
                                  <div className="group flex cursor-pointer items-center rounded-lg py-2 pl-11 pr-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                    <subItem.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                                    {subItem.name}
                                  </div>
                                </Link>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )
                  )}
                </nav>

                {/* User Profile & Logout */}
                <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Link href="/profile">
                      <div className="flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                            View profile
                          </p>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      title="Logout"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Top Bar */}
              <div className="flex h-20 items-center justify-end bg-white px-6 shadow-sm dark:bg-gray-800">
                <ToggleTheme />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                {children}
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <UIOnboarding />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Sidebar;
