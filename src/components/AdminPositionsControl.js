import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AdminPositonsTable from './AdminPositionsTable';

// פונקציה של מאטיריאל ליצירת הפאל של הטאבים
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
// פונקציה של מאטיריאל ליצירת הפרופס של הטאבים
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// סטיילינ - הוקס
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    top: '60px',
    right: '12%'
  },
}));

// פונקציה ראשית - שליטה בפאנל של האדמין
export default function AdminPositionsControl() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0); // הערך שהאדמין רוצה לפצות בו

  // פונקציה שאחראית על שינוי הערך שבו האדמין רוצה לצפות
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root} position="absolute" style={{ top: '250px' }}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Crypto" {...a11yProps(0)} />
          <Tab label="Currency pairs" {...a11yProps(1)} />
          <Tab label="Bonds" {...a11yProps(2)} />
          <Tab label="Comodity" {...a11yProps(3)} />
          <Tab label="Indexes" {...a11yProps(4)} />
          <Tab label="Stocks" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {<AdminPositonsTable positionType="crypto" />}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {<AdminPositonsTable positionType="pairs" />}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {<AdminPositonsTable positionType="bonds" />}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {<AdminPositonsTable positionType="comodity" />}
      </TabPanel>
      <TabPanel value={value} index={4}>
        {<AdminPositonsTable positionType="rest" />}
      </TabPanel>
      <TabPanel value={value} index={5}>
        {<AdminPositonsTable positionType="stocks" />}
      </TabPanel>
    </div>
  );
}