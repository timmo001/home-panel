const styles = (theme) => ({
  cardContainer: {
    position: 'relative',
    width: 130,
    [theme.breakpoints.down('sm')]: {
      width: 106,
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
    minHeight: 98,
    height: 98,
    [theme.breakpoints.down('sm')]: {
      minHeight: 74,
      height: 74,
    },
    padding: `${theme.spacing.unit * 1.5}px !important`,
  },
  name: {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '1.12rem',
    fontColor: theme.palette.text.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    }
  },
  icon: {
    margin: '0 auto',
    color: theme.palette.text.icon,
    fontSize: '2.7rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.7rem',
    }
  }
});

export default styles;
