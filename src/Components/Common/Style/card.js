const styles = (theme) => ({
  cardContainer: {
    position: 'relative',
    width: 'var(--width)',
    [theme.breakpoints.down('sm')]: {
      width: 'calc(var(--width) - 24px)',
    }
  },
  cardOuter: {
    height: '100%',
    width: '100%',
    textAlign: 'start',
  },
  card: {
    width: '100%',
    background: theme.palette.backgrounds.card.off,
  },
  cardOn: {
    background: theme.palette.backgrounds.card.on,
  },
  cardUnavailable: {
    background: theme.palette.backgrounds.card.disabled,
  },
  cardContent: {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 'var(--height)',
    height: 'var(--height)',
    [theme.breakpoints.down('sm')]: {
      minHeight: 'calc(var(--height) - 24px)',
      height: 'calc(var(--height) - 24px)',
    },
    padding: `${theme.spacing.unit * 1.5}px !important`,
  },
  name: {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '1.12rem',
    lineHeight: '1.34rem',
    color: theme.palette.text.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
      lineHeight: '1.14rem',
    }
  },
  icon: {
    margin: 'auto',
    color: theme.palette.text.icon,
    fontSize: '2.7rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.7rem',
    }
  }
});

export default styles;
