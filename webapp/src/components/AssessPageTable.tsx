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

  import { foodList } from '../assets/dataAssess';

   enum StatusTab {
        All,
        Milk,
        Fruit,
        Vegetable,
      }

const AssessPageTable = (/*currentStatusTab*/) => {
  /*, handleChangeTab*/
 

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
           default:
            return statusTab === StatusTab.Vegetable ? (
              <TableRow>{children}</TableRow>
            ) : null;
        }
      };
      
      interface TableCellWrapperProps {
        children?: React.ReactNode;
        index: number[];
        statusTab: number;
      }
      interface TableRowWrapperProps {
        children?: React.ReactNode;
        status: string;
        statusTab: number;
      }

 return 
 <p>TABLE</p>
//  <TableContainer component={Paper}>
// <Table sx={{ minWidth: 600 }} aria-label="simple table">
//   <TableHead>
//     <TableRow
//       sx={{
//         backgroundColor: '#333',
//         borderBottom: '2px solid black',
//         '& th': {
//           fontSize: '1rem',
//           color: 'white',
//           fontWeight: 'bold',
//         },
//       }}
//     >
//       <TableCellWrapper
//         statusTab={currentStatusTab}
//         index={[
//           StatusTab.All,
//           StatusTab.Milk,
//           StatusTab.Fruit,
//           StatusTab.Vegetable,
//         ]}
//       >
//         Name
//       </TableCellWrapper>
//       <TableCellWrapper
//         statusTab={currentStatusTab}
//         index={[StatusTab.All, StatusTab.Milk]}
//       >
//         Calories
//       </TableCellWrapper>
//       <TableCellWrapper
//         statusTab={currentStatusTab}
//         index={[StatusTab.All, StatusTab.Fruit]}
//       >
//         Fat
//       </TableCellWrapper>
//       <TableCellWrapper
//         statusTab={currentStatusTab}
//         index={[StatusTab.All, StatusTab.Vegetable, StatusTab.Milk]}
//       >
//         Carbs
//       </TableCellWrapper>
//       <TableCellWrapper
//         statusTab={currentStatusTab}
//         index={[StatusTab.All, StatusTab.Vegetable]}
//       >
//         Protein
//       </TableCellWrapper>
//     </TableRow>
//   </TableHead>
//   <TableBody>
//     {foodList.map(row => (
//        <TableRowWrapper
//         statusTab={currentStatusTab}
//         status={row.state}
//         key={row.name}
//       >
//         <TableCellWrapper
//           statusTab={currentStatusTab}
//           index={[
//             StatusTab.All,
//             StatusTab.Milk,
//             StatusTab.Fruit,
//             StatusTab.Vegetable,
//           ]}
//         >
//           <strong>{row.name}</strong>
//         </TableCellWrapper>
//         <TableCellWrapper
//           statusTab={currentStatusTab}
//           index={[StatusTab.All, StatusTab.Milk]}
//         >
//           {row.calories}
//         </TableCellWrapper>
//         <TableCellWrapper
//           statusTab={currentStatusTab}
//           index={[StatusTab.All, StatusTab.Milk, StatusTab.Vegetable]}
//         >
//           {row.carbs}
//         </TableCellWrapper>
//         <TableCellWrapper
//           statusTab={currentStatusTab}
//           index={[StatusTab.All, StatusTab.Fruit]}
//         >
//           {row.fat}
//         </TableCellWrapper>
//         <TableCellWrapper
//           statusTab={currentStatusTab}
//           index={[StatusTab.All, StatusTab.Vegetable]}
//         >
//           {row.protein}
//         </TableCellWrapper>
//       </TableRowWrapper>
//     ))}
//   </TableBody>
// </Table>
// </TableContainer> 

};

export default AssessPageTable;