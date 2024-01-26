import React, {useEffect, useState} from "react";
import {Button, Grid, TablePagination, Typography,} from "@mui/material";
import Header from "../../../components/Header";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import axios from 'axios';
import SearchBox from "../../../components/search-box/SearchBox";
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const WordList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const letter = searchParams.get("letter");
    const [response, setResponse] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [limit, setLimit] = useState(rowsPerPage);
    const navigate = useNavigate();
    const handlePageChange = (e: any, newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
        setLimit(rowsPerPage);
    };

    useEffect(() => {
        if (letter) {
            // Send a request to the server with page and limit parameters
            axios.get(`http://localhost:8000/dictionary/words?letter=${letter}&page=${currentPage}&limit=${limit}`)
                .then((response) => {
                    setResponse(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }
    }, [letter, currentPage, limit]);

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center">
                <Typography variant="h5">Loading...</Typography>
            </Grid>
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={2}>
                <Button onClick={()=>{
                    navigate(-1);}
                } variant={'contained'} size={'medium'}>Back</Button>
            </Grid>
            <Grid item xs={10}>
                <SearchBox/>
            </Grid>
            <Grid item xs={12}>
                <Header title={`${letter} - List of words`}/>
            </Grid>
            <Grid item xs={12}>
                {response.length === 0 ? (
                    <Typography variant="h5" color="textSecondary">
                        No data found
                    </Typography>
                ) : (
                    <Grid container>
                        {response.map((item, index) => (
                            <Grid item xs={12} md={3} sm={6} key={item.id}>
                                <List dense={true}>
                                    <Link to={`/word-details?word=${item?.word}`}
                                          style={{textDecoration: 'none', color: 'black'}}>
                                        <ListItem>
                                            <LabelOutlinedIcon sx={{marginRight: '10px'}}/>
                                            {`${item?.word}`}
                                        </ListItem>
                                    </Link>
                                </List>
                            </Grid>
                        ))}

                    </Grid>
                )}
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
                <TablePagination
                    component="div"
                    count={100}
                    page={currentPage}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>
    );
};

export default WordList;
