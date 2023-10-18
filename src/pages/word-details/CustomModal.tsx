import {Box, Button, Dialog, DialogActions, DialogContent, IconButton} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {ReactNode, useCallback, useEffect, useState} from 'react';
import {Close as CloseIcon} from '@mui/icons-material';
import clsx from 'clsx';

const PREFIX = 'CustomMuiModal';

const classes = {
    pageTitle: `${PREFIX}-pageTitle`,
    closeButton: `${PREFIX}-closeButton`,
};

const StyledDialog = styled(Dialog)(({theme}) => ({
    margin: 0,
    padding: theme.spacing(3),

    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0),
    },

    '& .MuiPaper-root': {
        borderRadius: '23px',

        [theme.breakpoints.down('sm')]: {
            width: '100%',
            margin: '20px',
        },
    },

    [`& .${classes.pageTitle}`]: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '50px',
        minHeight: '67px',
        boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.05)',
        borderRadius: '23px 23px 0px 0px',
    },

    [`& .titleAlign`]: {
        textAlign: 'center',
    },
    '& .titlePadding': {
        paddingLeft: '45px',
    },

    [`& .${classes.closeButton}`]: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '77px',
        height: '77px',
        right: 0,
        top: 5,
        color: theme.palette.grey[500],

        [theme.breakpoints.down('sm')]: {
            width: '50px',
        },
    },
}));

interface IProps {
    children: ReactNode;
    title: string | React.ReactNode;
    open?: boolean;
    onClose: () => void | ((params?: any) => void);
    titleCentered?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    contentPadding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
    sx?: any;
}

const CustomModal = ({
                         children,
                         open = true,
                         onClose,
                         maxWidth = 'md',
                         title,
                         titleCentered = false,
                         contentPadding = 'sm',
                         sx = {},
                     }: IProps) => {
    const [isOpen, setOpen] = useState<boolean>(open);

    const onCloseCallback = useCallback(() => {
        onClose();
        setOpen(false);
    }, []);

    useEffect(() => {
        setOpen(open);
    }, [open]);

    const customPadding = {
        sm: {padding: '8px'},
        md: {padding: '16px'},
        lg: {padding: '22px'},
        xl: {padding: '40px'},
        none: {padding: 0},
    };

    const textAlignStyle = titleCentered ? 'center' : 'left';

    const sxs = {
        ...customPadding[contentPadding],
        ...sx,
    };

    return (
        <StyledDialog
            maxWidth={maxWidth}
            fullWidth
            open={isOpen}
            onClose={onCloseCallback}
            aria-labelledby='responsive-dialog-title'>
            <Box
                className={clsx(classes.pageTitle, !titleCentered && 'titlePadding')}>
                <h3
                    style={{
                        textAlign: textAlignStyle,
                        fontSize: '24px',
                        lineHeight: '42px',
                    }}>
                    {title}
                </h3>
                <Box className={classes.closeButton}>
                    <IconButton aria-label='close' onClick={onCloseCallback} size='large'>
                        <CloseIcon/>
                    </IconButton>
                </Box>
            </Box>
            <DialogContent sx={sxs} dividers>{children}</DialogContent>
            <DialogActions>
                <Button variant={'outlined'} autoFocus onClick={onClose} sx={{
                    margin:'10px'
                }}>
                    Done
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};
export default CustomModal;
