import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
import {
  MdOutlineSpaceDashboard,
  MdCheckCircle,
  MdCreditCard,
  MdOutlineFlashOn,
  MdPieChart,
  MdSettings,
  MdMenu,
  MdBuild,
} from "react-icons/md";
import { IconType } from "react-icons";
import { ReactText } from "react";

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Dashboard", icon: MdOutlineSpaceDashboard, href: "/app" },
  { name: "Goal", icon: MdCheckCircle, href: "/app/goal" },
  { name: "Suggestions", icon: MdOutlineFlashOn, href: "/app/suggestions" },
  { name: "Budget", icon: MdPieChart, href: "/app/budget" },
  { name: "Accounts", icon: MdCreditCard, href: "/app/accounts" },
  { name: "Onboarding", icon: MdBuild, href: "/onboarding"}
];

const BottomItems: Array<LinkItemProps> = [
  { name: "Settings", icon: MdSettings, href: "/app/settings" },
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={"gray.50"}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={"gray.100"}
      borderRight="1px"
      borderRightColor={"gray.300"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex flexDir={"column"} height={"100%"}>
        <Flex h="20" alignItems="center" mx="4" justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Strive
          </Text>
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        <Flex flexDir={"column"} height={"100%"} justifyContent="space-between">
          <div>
            {LinkItems.map((link) => (
              <NavItem key={link.name} icon={link.icon} href={link.href}>
                {link.name}
              </NavItem>
            ))}
          </div>
          <div>
            {BottomItems.map((link) => (
              <NavItem key={link.name} icon={link.icon} href={link.href}>
                {link.name}
              </NavItem>
            ))}
          </div>
        </Flex>
      </Flex>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  href: string;
}
const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  return (
    <Link
      href={href}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="2"
        mx="2"
        mb="1.5"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "gray.200",
        }}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<MdMenu />}
      />

      <Text fontSize="2xl" ml="8" fontWeight="bold">
        Strive
      </Text>
    </Flex>
  );
};
