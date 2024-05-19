import Button from '@mui/material/Button';

import { styled } from '@mui/material/styles';
import * as Colors from '@mui/material/colors';


function ButtonsCustom(params) {

    let ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(Colors[params.color][500]),
        backgroundColor: Colors[params.color][500],
        '&:hover': {
          backgroundColor: Colors[params.color][700],
        },
    }));

    return(
        <ColorButton
            variant={params.variant ? params.variant : ""}
            className={params.cls ? params.cls : ""}
            onClick={params.click ? params.click : false}
            disabled={params.disabled ? params.disabled : false}
        >
            {params.text}
        </ColorButton>
    );
}

export default ButtonsCustom;