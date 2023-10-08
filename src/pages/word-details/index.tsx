import React, {useEffect, useState} from "react";
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableRow, TableCell, TableBody, IconButton
} from "@mui/material";
import {useSearchParams} from "react-router-dom";
import axios from "axios";
import {DataGrid, GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
import Divider from "@mui/material/Divider";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const API_URL = "http://localhost:8000/dictionary/word";

const WordDetailsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const word = searchParams.get("word");
    const [wordDetails, setWordDetails] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const columns: GridColDef[] = [
        {field: 'firstName', headerName: 'First name', width: 130},
        {field: 'lastName', headerName: 'Last name', width: 130},
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 90,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
    ];

    const rows = [
        {id: 1, lastName: 'Snow', firstName: 'Jon', age: 35},
        {id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42},
        {id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45},
        {id: 4, lastName: 'Stark', firstName: 'Arya', age: 16},
        {id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null},
        {id: 6, lastName: 'Melisandre', firstName: null, age: 150},
        {id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44},
        {id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36},
        {id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65},
    ];
    useEffect(() => {
        if (word) {
            axios
                .get(`${API_URL}?word=${word}`)
                .then((response) => {
                    setWordDetails(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                    setError("An error occurred while fetching data.");
                });
        }
    }, [word]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"

        >
            <Box width="100%" maxWidth="800px">
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}> <Typography variant="h2"
                                                                                                   align="center">
                    {wordDetails?.word} {wordDetails?.ipa ? `(${wordDetails.ipa})` : ""}
                </Typography><IconButton><VolumeUpIcon sx={{marginLeft: "5px"}}/></IconButton></Box>

                <Divider sx={{marginBottom: '25px'}}/>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                        <CircularProgress/>
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : wordDetails?.word ? (
                    <>

                        <TableContainer component={Paper}>
                            <Table sx={{minWidth: 650}} aria-label="simple table">
                                <TableHead sx={{backgroundColor: '#d8d8d8'}}>
                                    <TableRow>
                                        <TableCell>{"অভিন্ন বানান"}</TableCell>
                                        <TableCell align="center">{"অর্থ"}</TableCell>
                                        <TableCell align="center">{"পদ"}</TableCell>
                                        <TableCell align="center">{"উৎস"}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {wordDetails.hasOwnProperty("similar_spellings") &&
                                        wordDetails?.similar_spellings.map((spelling: any, index: number) => (
                                            <TableRow
                                                key={index}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                            >
                                                <TableCell>
                                                    {spelling?.meaning_no}
                                                </TableCell>
                                                <TableCell align="center">{spelling?.meaning}</TableCell>
                                                <TableCell
                                                    align="center">{spelling?.pos ? spelling?.pos : "-"}</TableCell>
                                                <TableCell
                                                    align="center">{spelling?.source ? spelling?.source : "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/*{wordDetails.hasOwnProperty("similar_spellings") &&
                            wordDetails?.similar_spellings.map((spelling: any, index: number) => (
                                <Box key={spelling.id}>
                                    <Typography variant="subtitle1">
                                        {spelling.meaning_no}: {spelling?.meaning}
                                    </Typography>
                                    {index < wordDetails.similar_spellings.length - 1 && (
                                        <Box sx={{my: 1, borderBottom: "1px solid #ccc"}}/>
                                    )}
                                </Box>
                            ))}*/}
                    </>
                ) : (
                    <Paper elevation={3} sx={{padding: 2}}>
                        <Typography variant="body1">
                            Word not found. Please check the word and try again.
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Box>
);
};

export default WordDetailsPage;
