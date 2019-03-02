const styles = theme => ({
  cardContainer: {
    position: 'relative',
    height: 'calc(var(--height) * 130px)',
    width: 'calc(var(--width) * 130px)',
    [theme.breakpoints.down('sm')]: {
      height: 'calc(var(--height) * 106px)',
      width: 'calc(var(--width) * 106px)'
    }
  },
  cardOuter: {
    height: '100%',
    width: '100%',
    textAlign: 'start'
  },
  card: {
    height: '-webkit-fill-available',
    width: '100%',
    background: theme.palette.backgrounds.card.off
  },
  cardOn: {
    background: theme.palette.backgrounds.card.on
  },
  cardUnavailable: {
    background: theme.palette.backgrounds.card.disabled
  },
  cardContent: {
    height: '-webkit-fill-available',
    display: 'flex',
    flexWrap: 'wrap',
    padding: `${theme.spacing.unit * 1.5}px !important`
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
      lineHeight: '1.14rem'
    }
  },
  icon: {
    margin: 'auto',
    color: theme.palette.text.icon,
    fontSize: '2.7rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.7rem'
    }
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  editOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }
});

export default styles;
