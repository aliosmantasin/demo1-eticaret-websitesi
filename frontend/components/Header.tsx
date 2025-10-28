import { HeaderDesktop } from "./navbar/HeaderDesktop";
import { HeaderMobil } from "./navbar/HeaderMobil";
import { CategoryNavbar } from "./navbar/CategoryNavbar";
import { InfoBar } from "./navbar/InfoBar";

const Header = () => {
  return (
    <header>
      <HeaderDesktop />
      <HeaderMobil />
      <CategoryNavbar />
      <InfoBar />
    </header>
  );
};

export default Header;