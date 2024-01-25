
import Logo from '../../components/icons/Logo';
import { LoginPanel } from '../LoginPanel';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'preact/hooks';
import {Bars3Icon, BellIcon, PlusIcon, UserCircleIcon, XMarkIcon} from '@heroicons/react/24/outline';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { supabase } from '../../../systems/initSupabase';
import { Fragment } from 'preact/jsx-runtime';
import { getRandomName } from '../../../core/_shared/utils';
import { user as userStore } from '../../../systems/User';


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
  const user = userStore();
  const navigate = useNavigate();
  const name = user?.serviceData?.identities?.at(0)?.identity_data?.name || getRandomName();
  console.log({user})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const navigation = [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
    { name: 'Sign out', type: 'button', onClick: () => {setSigningOut(true);} }
  ]
  
  return (
    /**@ts-ignore */
    <Disclosure as="nav" className="bg-gray-800 absolute top-0 w-full">
      {({ open }: {open: boolean}) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center">
                  <Logo />
                  <div className="text-xl ml-3 text-white">Ambaic Realms</div>
                  {/* <img
                    className="hidden h-8 w-auto lg:block"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  /> */}
                </div>
                {/* <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div> */}
              </div>
              <div className="flex items-center">
                
                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                  <button
                    type="button"
                    className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  {user.serviceData?.identities ?
                    <>
                      {/* Profile dropdown */}
                      {/**@ts-ignore */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            {/* <img className="h-8 w-8 rounded-full" src={user.u} alt="" /> */}
                            <UserCircleIcon className="text-white text-scale-900 dark:text-scale-1100 w-6" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute cursor-pointer right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {navigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }: {active: boolean}) => (
                                  
                                  <div
                                    onClick={item.onClick ?? undefined}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    {item.name}
                                  </div>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </>
                    :
                    <div className="flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {setSigninOpen(!signinOpen)}}
                        className="relative inline-flex items-center gap-x-2 ml-2 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        <UserCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                        Sign in
                      </button>
                      <LoginPanel signinOpen={signinOpen} closer={() => {setSigninOpen(false);}}/>
                    </div>
                  }
                  
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            {/* <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="button"
                  onClick={() => {setSigningOut(true)}}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div> */}
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5 sm:px-6">
                <div className="flex-shrink-0">
                  {/* <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" /> */}
                  <UserCircleIcon className="text-white text-scale-900 dark:text-scale-1100 w-6"/>
                  
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{name}</div>
                  <div className="text-sm font-medium text-gray-400">{user?.serviceData?.identities?.[0].identity_data?.email || ''}</div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2 sm:px-3">
                {user.serviceData?.identities?.[0].identity_data && navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="button"
                    //@ts-ignore
                    onClick={() => {setSigningOut(true);}}
                    //@ts-ignore
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
