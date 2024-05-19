// React Components
import React, { useState, useRef, useCallback } from 'react';
import { useEffect } from 'react';

// NPM´s
import { toJpeg } from 'html-to-image';
import { useCookies } from 'react-cookie';

// Material UI Components
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Container, Divider, TextField, FormControl, Table, TableBody, TableContainer, Paper, TableHead, TableRow, TableCell, IconButton, Collapse } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// Material Icons
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Components
import ButtonsCustom from './Components/ButtonsCustom';

// Styles
import './App.css';
import { styled } from '@mui/material/styles';

// Images
import logo from "./image/Logo.svg"

function formatearFecha(fecha) {
	return fecha.charAt(0).toUpperCase() + fecha.slice(1).toLowerCase();
}

const ExpandMore = styled((props) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
  })(({ theme, expand }) => ({
	transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
	  duration: theme.transitions.duration.shortest,
	}),
}));

function App() {

	let convertir = require('numero-a-letras');
	const fechaDeHoy = new Date().toLocaleDateString('es-ES', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	  });

	// eslint-disable-next-line
	const [Dia, DiaNumero, c , Mes, e, Año] = fechaDeHoy.split(' ');

	const FechaDeHoy = `${formatearFecha(Dia)} ${formatearFecha(DiaNumero)} de ${formatearFecha(Mes)} de ${Año}`;

	// Dialog Functions
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const [concept, setconcept] = useState([])
	const [numero, setNumero] = useState("")
	const [nombre, setNombre] = useState("")
	const [concepto, setConcepto] = useState("")
	const [total, setTotal] = useState(0)

	// const addData = (e, x) => {
	// 	let tempData = data;

	// 	if(x === "Numero"){
	// 		tempData.Numero = e.target.value
	// 	}
	// 	if(x === "Nombre"){
	// 		tempData.Nombre = e.target.value
	// 	}
	// 	if(x === "Concepto"){
	// 		tempData.Concepto = e.target.value
	// 	}
	// 	setData({...tempData})
	// }

	const [viewCtd, setViewCtd] = useState(false)
	const [ctd, setCtd] = useState(viewCtd ? "" : 1)
	const [des, setDes] = useState("")
	const [sub, setSub] = useState("")

	const changeConcept = (e, data) => {
		if(data === "Cantidad"){
			setCtd(e.target.value)
		}
		if(data === "Descripcion"){
			setDes(e.target.value)
		}
		if(data === "Subtotal"){
			setSub(e.target.value)
		}
	}

	const addConcept = () => {
		let tempConcept = {
			Cantidad: ctd,
			Descripcion: des,
			Subtotal: sub
		}
		let plusconcept = concept

		if(ctd !== "" && des !== "" && sub !== ""){
			plusconcept.push(tempConcept)
			setconcept([...plusconcept])
			setCtd(viewCtd ? "" : 1)
			setDes("")
			setSub("")
		}

		let temptotal = 0

		plusconcept.forEach(element => {
			temptotal = parseFloat(temptotal) + (parseFloat(element.Subtotal) * element.Cantidad)
		})

		setTotal(temptotal)
	}

	const deleteConcept = (i)=>{
		let tempconcept = concept;
		tempconcept.splice(i, 1);
		setconcept([...tempconcept])

		let temptotal = 0
		tempconcept.forEach(element => {
			temptotal = parseFloat(temptotal) + (parseFloat(element.Subtotal) * element.Cantidad)
		})
		setTotal(temptotal)
	}

	const [expanded, setExpanded] = React.useState(true);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const ref = useRef(null)

	const onButtonClick = useCallback(() => {
		if (ref.current === null) {
			return
		}

		toJpeg(ref.current, {
			width: "639.5",
			height: "827",
			canvasWidth: "1279",
			canvasHeight: "1654"
		})
		.then((dataUrl) => {
			const link = document.createElement('a')
			link.download = numero+" - "+nombre+" - "+fechaDeHoy+'.jpg'
			link.href = dataUrl
			link.click()
			endInvoice()
		})
		.catch((err) => {
			console.log(err)
		})
	}, [ref, numero, nombre, fechaDeHoy])

	const [cookies, setCookie] = useCookies(["number"]);

	const endInvoice = () => {
		setCookie("number", numero, {
			path: "/",
			maxAge: 99000000
		})
		handleClose()
		setNombre("")
		setConcepto("")
		setconcept([])
	}

	useEffect(()=>{
		let tempNumero = numero;
		if(!cookies.number){
			setCookie("number", 115, {
				path: "/",
				maxAge: 99000000
			})
			tempNumero = 115
			setNumero(tempNumero)
		} else {
			// let tempData = data;
			tempNumero = cookies.number + 1
			setNumero(tempNumero)
		}
	// eslint-disable-next-line
	}, [cookies])

  	return (
		<div style={{position: "relative"}}>
			<ButtonsCustom
				cls="btnViewInvoice"
				color="blue"
				text="Ver Recibo"
				click={handleClickOpen}
			/>
			<div className='header'>
				<img src={logo} alt='Logotipo aHouse'/>
			</div>

			<Container style={{marginBottom: "150px"}}>
				<FormControl className='input' autoComplete="off">
					<Card className='my-20'>
						<CardContent className='p-20'>
							<Grid container spacing={2}>
								<Grid xs={12} md={6} className="centerY textAlingLeft">
									<h2>Recibo</h2>
								</Grid>
								<Grid xs={12} md={6} className="centerYE textAlingRight">
									<h4>{FechaDeHoy}</h4>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
					<Divider className='my-20' />
					<Card className='my-20'>
						<CardContent>
							<h3>Información General</h3>
							<Grid container spacing={2} className="my-20">
								<Grid xs={12} md={2}>
									<TextField value={numero} onChange={(e)=>{setNumero(e.target.value)}} className='input ' id="NumerodeRecivo" label="Numero" variant="outlined" type='number'/>
								</Grid>
								<Grid xs={12} md={4}>
									<TextField value={nombre} onChange={(e)=>{setNombre(e.target.value)}} className='input ' id="ClienteNombre" label="Cliente" variant="outlined" />
								</Grid>
								<Grid xs={12} md={6}>
									<TextField value={concepto} onChange={(e)=>{setConcepto(e.target.value)}} className='input ' id="Concepto" label="Concepto" variant="outlined" />
								</Grid>
							</Grid>
						</CardContent>
					</Card>
					<Divider className='my-20' />
					<Card className='my-20'>
						<CardContent>
							<Grid container spacing={0}>
								<Grid xs={7} md={4} className="centerY">
									<h3>Agregar Conceptos</h3>
								</Grid>
								<Grid xs={2} md={2}>
									<FormControlLabel control={<Switch checked={viewCtd} onChange={e => {setViewCtd(e.target.checked); setCtd(1)}} />} label="Cantidad" />
								</Grid>
								<Grid xs={3} md={6} className="centerYE">
									<ExpandMore
										expand={expanded}
										onClick={handleExpandClick}
										aria-expanded={expanded}
										aria-label="show more"
									>
										<ExpandMoreIcon />
										{viewCtd}
									</ExpandMore>
								</Grid>
							</Grid>
							<Collapse in={expanded} timeout="auto" unmountOnExit>
								<Grid container spacing={2} className="my-20">
									{viewCtd &&
									<Grid xs={12} md={2}>
										<TextField value={ctd} onChange={(e)=>{changeConcept(e, "Cantidad")}} className='input' id="cantidad" label="Cantidad" variant="outlined"  type='number' />
									</Grid>
									}
									<Grid xs={12} md={6}>
										<TextField value={des} onChange={(e)=>{changeConcept(e, "Descripcion")}} className='input' id="descripcion" label="Descripcion" variant="outlined" />
									</Grid>
									<Grid xs={12} md={viewCtd ? 2 : 4}>
										<TextField value={sub} onChange={(e)=>{changeConcept(e, "Subtotal")}} className='input' id="subtotal" label="Sub Total (Unidad)" variant="outlined" type='number' />
									</Grid>
									<Grid xs={12} md={2} className="center">
										<ButtonsCustom
											cls="my-20"
											color={ctd.length !==0 && des.length !== 0 && sub.length !== 0 ? "pink" : "grey"}
											text="Agregar"
											disabled={ctd.length !==0 && des.length !== 0 && sub.length !== 0 ? false : true}
											click={addConcept}
										/>
									</Grid>
								</Grid>
							</Collapse>
						</CardContent>
					</Card>
				</FormControl>
				<TableContainer component={Paper} className='my-20'>
					<Table  aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell width={20} style={{textAlign: "center"}}>Cant.</TableCell>
								<TableCell>Descripcion</TableCell>
								<TableCell>Subtotal</TableCell>
								<TableCell width={70} style={{textAlign: "center"}}>Edit</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{concept.length !== 0 &&
						concept.map((data, i)=>{
							return(
								<TableRow key={i}>
									<TableCell style={{textAlign: "center"}}>{data.Cantidad}</TableCell>
									<TableCell>{data.Descripcion}</TableCell>
									<TableCell>${data.Subtotal.toLocaleString()}</TableCell>
									<TableCell className='center'>
										<IconButton onClick={()=>{deleteConcept(i)}}>
											<DeleteIcon/>
										</IconButton>
									</TableCell>
								</TableRow>
							)
						})}
						</TableBody>
					</Table>
				</TableContainer>
			</Container>

			{/* Invoice View to Export */}
			<Dialog
				fullWidth={false}
				maxWidth={false}
				open={open}
				onClose={handleClose}
			>
				<DialogTitle>Vista Previa</DialogTitle>
				<DialogContent>
					<Box noValidate component="form">
						<div ref={ref} className="view">
							<div className='Ihead'>
								<div className='Iboxes'>
									<div className='box b1'></div>
									<div className='box b2'></div>
									<div className='box b3'></div>
								</div>
								<div className='Ilogo'>
									<img src={logo} alt='Logotipo aHouse'/>
								</div>
								<div className='Inumero'>
									<p>No. {numero}</p>
								</div>
							</div>
							<div className='Icontenido'>
								<div className='Ifline'>
									<h1>Recibo</h1>
									<p>Concepto</p>
								</div>
								<div className='Isline'>
									<h3>{nombre}</h3>
									<h3>{concepto}</h3>
								</div>

								<div className='Idata'>
									<div className='Idatatitle'>
										<h4 className='Ican'>CANT.</h4>
										<h4 className='Ides'>DESCRIPCION</h4>
										<h4 className='Isub'>SUBTOTAL</h4>
									</div>
									<div className='Idivider'></div>
								</div>
								<div className='Icons'>
								{concept.length !== 0 &&
									concept.map((data, i)=>{
										return(
											<div key={i} className='Iconcepts'>
												<h4 className='Ican'>{data.Cantidad}</h4>
												<h4 className='Ides'>{data.Descripcion}</h4>
												<h4 className='Isub'>${data.Subtotal.toLocaleString()}</h4>
											</div>
										)
									})
								}
								</div>
								<div className='Itotaldata'>
									<div className='Itotalletter'><h4>TOTAL</h4></div>
									<div className='Idivider'></div>
									<div className='Itotalnumber'><h3>${total.toLocaleString()}</h3></div>
									<div className='Itotaltext'>{convertir.NumerosALetras(total)}</div>
									<div className='Idivider'></div>
									<div className='Ifecha'>{FechaDeHoy}</div>
								</div>
							</div>
							<div className='Ifooter'>
								<h3>Norma Lydia Aldana Gómez</h3>
							</div>
						</div>
					</Box>
				</DialogContent>
				<DialogActions>
					<ButtonsCustom color="red" text="Cerrar" click={handleClose}/>
					<ButtonsCustom color="blue" text="Descargar imagen" click={onButtonClick}/>
				</DialogActions>
			</Dialog>
		</div>
  	);
}

export default App;
