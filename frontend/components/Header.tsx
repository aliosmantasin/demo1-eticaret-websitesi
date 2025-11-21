import { NavbarDesktop } from "./navbar/HeaderDesktop";
import { NavbarMobil } from "./navbar/HeaderMobil";
import { CategoryNavbar } from "./navbar/CategoryNavbar";
import { InfoBar } from "./navbar/InfoBar";
import { Marquee } from "./navbar/Marquee";

const Header = () => {
  return (
    <header>
      <Marquee />
      <NavbarDesktop />
      <NavbarMobil />
      <CategoryNavbar />
      <InfoBar />
    </header>
  );
};

export default Header;