import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getData, selectData, selectLoading } from './chartSlice';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { RSA_NO_PADDING } from 'constants';

type Ticker = {[key: string]: string };
interface IChartData {
    data: number;
    date: string;
}

const tickers: Ticker = {
    AAPL: 'Apple Inc',
    AMZN: 'Amazon.com',
    TSLA: 'Tesla Inc',
};

const AMOUNT = 10000;
const CURRENCY = '\u0024';
const FORMAT = 'MM/DD/YYYY';

const StyledTypography = styled(Typography)(({ theme }) => ({
    opacity: 0.4,
}));

export const Chart = () => {
    const dispatch = useAppDispatch();
    const [ticker, setTicker] = useState(Object.keys(tickers)[0]);
    const [range, setRange] = useState(144);
    const data = useAppSelector(selectData);
    const loading = useAppSelector(selectLoading);
    const date = dayjs((data?.performance[range][0] as unknown as number)).format(FORMAT);
    const maxDate = dayjs((data?.performance[data.performance.length - 1][0] as unknown as number));
    const minDate = dayjs((data?.performance[0][0] as unknown as number));

    useEffect(() => {
        dispatch(getData(ticker));
    }, [dispatch, ticker]); 

    const accumulator = (arr: Array<Array<[number, number]>>) =>
        arr.reduce((acc, [a, b]) => acc + (b as unknown as number), 0);

    const getChartData = () => {
        let chartData: Array<IChartData> = [];
        const sixMonthsRange = Math.ceil(range / 24);
        const divisible = range % 24 === 0;

        if(data) {
            for(let i = 0; i <  sixMonthsRange; i++) {
                const first = i ? (i * 24) : 0;
                const last = !divisible && i + 1 === sixMonthsRange ? range : 24 * (i + 1); 

                chartData.push({
                    data: accumulator((
                        data?.performance.slice(first, last)) as unknown as Array<Array<[number, number]>>
                    ),
                    date: dayjs((data.performance[last][0] as unknown as number)).format(FORMAT),
                });
            }
        
        }

        return chartData.map(({ data, date }) => ([date, AMOUNT + (100 * data)]));
    }

    const handleChangeTicker = (event: SelectChangeEvent) => {
        setTicker(event.target.value as string);
    };

    const handleChangeDate = (newValue: Dayjs | null) => {
        if(newValue) {
            data?.performance.find(([a, b], i) => {
                if(newValue.format(FORMAT) === dayjs(a as unknown as number).format(FORMAT)) {
                    setRange(i);
                    return true;
                }

                return false;
            })
        }
    };

    const checkDate = (checkDate: Dayjs) => checkDate.day() !== 4

    if(loading) {
        return (
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        );
    }

    if(!data) {
        <Typography variant="h5" gutterBottom>
            No data available
        </Typography>
    }

    return (
        <div>
            <Grid container>
                <Grid item xs={6}>
                    <Typography variant="h6">Growth of {AMOUNT}{CURRENCY}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <StyledTypography variant="h6">{data?.ticker}:{data?.exchange}</StyledTypography>
                </Grid>
            </Grid>    
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                        series: [{ name: ticker, data: getChartData() }], 
                        title: { text: ''},
                        xAxis: {
                            visible: false,
                        },
                        yAxis: {
                            visible: false,
                        }
                    }}
                />
                <Grid container>
                    <Grid item xs={6}>
                        <Select
                            value={ticker}
                            onChange={handleChangeTicker}
                        >
                            {Object.keys(tickers).map(key => <MenuItem key={key} value={key}>{tickers[key]}</MenuItem>)}
                        </Select>
                    </Grid>
                    <Grid item xs={6}>
                        <DesktopDatePicker
                            shouldDisableDate={checkDate}
                            value={date}
                            onChange={handleChangeDate}
                            renderInput={(params) => <TextField {...params} />}
                            maxDate={maxDate}
                            minDate={minDate}
                        />
                    </Grid>
                </Grid>
            </LocalizationProvider>        
        </div>
)}