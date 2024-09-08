import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Telegram,
} from "@mui/icons-material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Image from "next/image";

import Logo from "@/assets/images/0.png";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Ijtimoiy tarmoqlarimiz</h3>
          <ul>
            <Link href="https://t.me/pubg_zoneuz">
              <li className="flex items-center mb-2">
                <Telegram className="mr-2 text-blue-500" />
                <p className="hover:text-blue-400">Telegram</p>
              </li>
            </Link>
            <Link href="https://www.youtube.com/@CyberPubgZone">
              <li className="flex items-center mb-2">
                <YouTube className="mr-2 text-red-500" />
                <p className="hover:text-red-400">YouTube</p>
              </li>
            </Link>
            <Link href="https://">
              <li className="flex items-center mb-2">
                <Instagram className="mr-2 text-pink-500" />
                <p className="hover:text-pink-400">Instagram</p>
              </li>
            </Link>
            <Link href="https://">
              <li className="flex items-center mb-2">
                <Facebook className="mr-2 text-blue-600" />
                <p className="hover:text-blue-500">Facebook</p>
              </li>
            </Link>
          </ul>
        </div>

        {/* Biz bilan aloqa */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Biz bilan aloqa</h3>
          <ul>
            <li className="flex items-center mb-2">
              <Telegram className="mr-2 text-blue-500" />
              <span>Qo&rsquo;llab-quvvatlash xizmati</span>
            </li>
            <li className="flex items-center mb-2">
              <Telegram className="mr-2 text-blue-500" />
              <a href="#" className="hover:text-blue-400">
                Telegram Admin
              </a>
            </li>
            <li className="flex items-center mb-2">
              <MailOutlineIcon />
              <a
                href="mailto:example@gmail.com"
                className="hover:text-blue-400 ml-2"
              >
                example@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* PUBG logolar */}
        <div className="text-center md:text-left">
          <div className="flex justify-center md:justify-start space-x-4">
            <Image src={Logo} alt="PUBG Logo 1" width={120} height={120} />
            <Image
              src="https://www.pubgmobile.com/images/event/brandassets/down-logo8.png"
              width={120}
              height={120}
              alt="PUBG Logo 2"
            />
          </div>
        </div>
      </div>

      <hr className="my-8 border-gray-700" />

      {/* Footer ostida */}
      <div className="container mx-auto grid grid-cols-2 gap-5 md:grid-cols-4 justify-between items-center text-sm text-gray-400">
        {/* <div className="flex space-x-6"> */}
        <Image
          src="https://companieslogo.com/img/orig/259960.KS_BIG.D-0e1f8722.png?t=1720244490"
          width={200}
          height={200}
          alt="Krafton Logo"
          className="w-24"
        />
        <Image
          src="https://www.levelinfinite.com/wp-content/uploads/2024/03/Level_Infinite_Logo_White_CMYK.png"
          alt="Level Infinite Logo"
          width={200}
          height={200}
          className="w-24"
        />
        <Image
          src="https://cdn.mobygames.com/logos/18054959-lightspeed-quantum-studios-group.png"
          alt="Lightspeed Studios Logo"
          width={200}
          height={200}
          className="w-24"
        />
        {/* </div> */}
        <p>&copy; 2024 PUBG Zone. All rights reserved. It&rsquo;s a great day!</p>
      </div>
    </footer>
  );
};

export default Footer;
