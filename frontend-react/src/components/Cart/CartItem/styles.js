import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    color: "mintcream",
  },
  media: {
    height: 260,
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cartActions: {
    justifyContent: 'space-around',
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
  },
}));