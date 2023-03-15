import React, { useState } from 'react';

import {
  Box,
  Chip,
  Container,
  Stack,
  Button,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Tabs,
  Tab,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';

import { formatDateTime } from '../helpers/dateTime';
import { assessmentList } from '../assets/data';

import { foodList } from '../assets/dataAssess';

// function createData(
//     name: string,
//     calories: number,
//     fat: number,
//     carbs: number,
//     protein: number,
//   ) {
//     return { name, calories, fat, carbs, protein };
//   }

//   const rows = [
//     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//     createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//     createData('Eclair', 262, 16.0, 24, 6.0),
//     createData('Cupcake', 305, 3.7, 67, 4.3),
//     createData('Gingerbread', 356, 16.0, 49, 3.9),
//   ];

enum StatusTab {
  All,
  Milk,
  Fruit,
  Vegetable,
}

const TableCellWrapper = (props: TableCellWrapperProps) => {
  const { children, statusTab, index } = props;
  return index.includes(statusTab) ? <TableCell>{children}</TableCell> : null;
};

const TableRowWrapper = (props: TableRowWrapperProps) => {
  const { children, status, statusTab } = props;
  if (statusTab === StatusTab.All) {
    return <TableRow>{children}</TableRow>;
  }
  switch (status) {
    case 'Milk':
      return statusTab === StatusTab.Milk ? (
        <TableRow>{children}</TableRow>
      ) : null;
    case 'Fruit':
      return statusTab === StatusTab.Fruit ? (
        <TableRow>{children}</TableRow>
      ) : null;
    case 'Submitted':
    case 'Graded':
    case 'Unsubmitted':
    default:
      return statusTab === StatusTab.Vegetable ? (
        <TableRow>{children}</TableRow>
      ) : null;
  }
};

// export interface FoodRow {
//   name: string;
//   state: string;
//   calories: number;
//   fat: number;
//   carbs: number;
//   protein: number;
// }

// export const foodList: FoodRow[] = [
//   {
//     name: 'Frozen yoghurt',
//     state: 'Milk',
//     calories: 159,
//     fat: 6,
//     carbs: 24,
//     protein: 4,
//   },
//   {
//     name: 'apple',
//     state: 'Fruit',
//     calories: 159,
//     fat: 6,
//     carbs: 24,
//     protein: 4,
//   },
//   {
//     name: 'cheese',
//     state: 'Milk',
//     calories: 159,
//     fat: 6,
//     carbs: 24,
//     protein: 4,
//   },
//   {
//     name: 'banana',
//     state: 'Fruit',
//     calories: 159,
//     fat: 6,
//     carbs: 24,
//     protein: 4,
//   },
//   {
//     name: 'tomato',
//     state: 'Fruit',
//     calories: 159,
//     fat: 6,
//     carbs: 24,
//     protein: 4,
//   },
//   {
//     name: 'lettuce',
//     state: 'Vegetable',
//     calories: 159,
//     fat: 6,
//     carbs: 24,
//     protein: 4,
//   },
//   {
//     name: 'coliflower',
//     state: 'Vegetable',
//     calories: 159,
//     fat: 6,
//     carbs: 24,
//     protein: 4,
//   },
//   { name: 'milk', state: 'Milk', calories: 159, fat: 6, carbs: 24, protein: 4 },
// ];

interface TableCellWrapperProps {
  children?: React.ReactNode;
  index: number[];
  statusTab: number;
}
interface TableRowWrapperProps {
  children?: React.ReactNode;
  statusTab: number;
  status: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// function a11yProps(index: number) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   };
// }

//export default function AssessPage() {
const AssessPageInitial = () => {
  // const [value, setValue] = React.useState(0);

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  // };

  const [currentStatusTab, setCurrentStatusTab] = useState(StatusTab.Fruit);
  const handleChangeTab = (
    event: React.SyntheticEvent,
    newCurrentStatusTab: number
  ) => {
    setCurrentStatusTab(newCurrentStatusTab);
  };

  return (
    <Container>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentStatusTab}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
          >
            <Tab label="All" /*{...a11yProps(0)} */ />
            <Tab label="Milk" /*{...a11yProps(1)}*/ />
            <Tab label="Fruit" /*{...a11yProps(2)}*/ />
            <Tab label="Vegetable" />
          </Tabs>
        </Box>
        {/* <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel> */}
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#333',
                borderBottom: '2px solid black',
                '& th': {
                  fontSize: '1rem',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
            >
              {/* <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[
                  StatusTab.All,
                  StatusTab.Milk,
                  StatusTab.Fruit,
                  StatusTab.Vegetable,
                ]}
              >
                Name
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.All, StatusTab.Milk]}
              >
                Calories
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.All, StatusTab.Fruit]}
              >
                Fat
              </TableCellWrapper>
              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.All, StatusTab.Vegetable, StatusTab.Milk]}
              >
                Carbs
              </TableCellWrapper>

              <TableCellWrapper
                statusTab={currentStatusTab}
                index={[StatusTab.All, StatusTab.Vegetable]}
              >
                Protein
              </TableCellWrapper>
            </TableRow>
          </TableHead>
          <TableBody>
            {foodList.map(row => (
              // <TableRow
              //   key={row.name}
              //   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              // >
              //   <TableCell component="th" scope="row">
              //     {row.name}
              //   </TableCell>
              //   <TableCell align="right">{row.calories}</TableCell>
              //   <TableCell align="right">{row.fat}</TableCell>
              //   <TableCell align="right">{row.carbs}</TableCell>
              //   <TableCell align="right">{row.protein}</TableCell>
              // </TableRow>

              <TableRowWrapper
                statusTab={currentStatusTab}
                status={row.state}
                key={row.name}
              >
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[
                    StatusTab.All,
                    StatusTab.Milk,
                    StatusTab.Fruit,
                    StatusTab.Vegetable,
                  ]}
                >
                  <strong>{row.name}</strong>
                  {/* <br />
                {assessment.curriculum_assessment.description} */}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.All, StatusTab.Milk]}
                >
                  {row.calories}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.All, StatusTab.Milk, StatusTab.Vegetable]}
                >
                  {row.carbs}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.All, StatusTab.Fruit]}
                >
                  {row.fat}
                </TableCellWrapper>
                <TableCellWrapper
                  statusTab={currentStatusTab}
                  index={[StatusTab.All, StatusTab.Vegetable]}
                >
                  {row.protein}
                </TableCellWrapper>
              </TableRowWrapper>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default AssessPageInitial;
