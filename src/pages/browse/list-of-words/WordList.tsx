import React, {useEffect, useState} from "react";
import {
    Accordion,
    Box,
    Grid, ListItemText,
    Pagination,
    Typography,
} from "@mui/material";
import Header from "../../../components/Header";
import {useSearchParams} from "react-router-dom";
import axios from 'axios';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchBox from "../../../components/search-box/SearchBox";
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import {Link} from "react-router-dom";

const ITEMS_PER_PAGE = 25;

const WordList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const letter = searchParams.get("letter");
    const [response, setResponse] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (e: any, newPage: number) => {
        setCurrentPage(newPage);
    };
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = response.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const [expandedAccordion, setExpandedAccordion] = useState<any>(null);

    const handleAccordionChange = (index: number) => {
        if (expandedAccordion === index) {
            setExpandedAccordion(null);
        } else {
            setExpandedAccordion(index);
        }
    };
    useEffect(() => {
        if (letter) {
            axios.get(`http://localhost:8000/dictionary/words_by_letter/?letter=${letter}`)
                .then((response) => {
                    setResponse(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }
    }, [letter]);

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center">
                <Typography variant="h5">Loading...</Typography>
            </Grid>
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
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
                        {paginatedData.map((item, index) => (
                            <Grid item xs={12} md={3} sm={6}>
                                <List dense={true}>
                                    <Link to={`/word-details?word=${item?.word}`}
                                          style={{textDecoration: 'none', color: 'black'}}>
                                        <ListItem>
                                            <LabelOutlinedIcon sx={{marginRight: '10px'}}/>
                                            {`${item?.word}`}
                                        </ListItem>
                                    </Link>
                                </List></Grid>



                            ))}
                    </Grid>
                )}
            </Grid>
            {response.length > ITEMS_PER_PAGE && (
                <Grid item xs={12} display="flex" justifyContent="center">
                    <Pagination
                        count={Math.ceil(response.length / ITEMS_PER_PAGE)}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="secondary"
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default WordList;
