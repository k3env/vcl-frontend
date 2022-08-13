import { SyntheticEvent, useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ThemeSwitch } from "./ThemeSwitch";
import { Link, LinkProps, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
// import { MantineLogo } from "@mantine/ds";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
}

function HeaderLink({ children, to, ...props }: LinkProps) {
  const { classes, cx } = useStyles();
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });
  // console.log(cx(classes.link, { [classes.linkActive]: match !== null, }))
  return (
    <Link
      to={to}
      className={cx(classes.link, { [classes.linkActive]: match !== null, })} {...props}
    >
      {children}
    </Link>
  )
}

export function AppHeader({ links }: HeaderResponsiveProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  // const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();

  const nav = useNavigate();
  // links.map(({ link }) => {
  //   const resolved = useResolvedPath(link)
  //   const match = useMatch({ path: resolved.pathname, end: true });
  //   if (match) {
  //     setActive(link)
  //   }
  // })

  const handleClick = (e: SyntheticEvent, link: string) => {
    e.preventDefault()
    // setActive(link)
    nav(link)
    close()
  }

  const items = links.map((link) => (
    <HeaderLink key={link.label} to={link.link} onClick={(e) => handleClick(e, link.link)}>{link.label}</HeaderLink>
  ));

  return (
    <Header height={HEADER_HEIGHT} mb={20} className={classes.root}>
      <Container className={classes.header}>
        {/* <MantineLogo size={28} /> */}
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Group spacing="md">
          <ThemeSwitch />
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
