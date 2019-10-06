// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'absolute',
    // overflow: 'hidden',
    top: theme.spacing(1),
    bottom: theme.spacing(1),
    left: theme.spacing(-1.5),
    right: theme.spacing(-1.25)
  }
}));

export const chartTypes: { [type: string]: string } = {
  line: 'Line',
  area: 'Area',
  bar: 'Bar',
  histogram: 'Histogram',
  radialBar: 'Gauge'
};

export type ChartData = {
  value: number;
};

interface ChartProps {
  color?: string;
  labels?: boolean;
  lowerGauge?: boolean;
  data: ChartData[];
  type?: 'line' | 'area' | 'bar' | 'histogram' | 'radialBar';
}

function Chart(props: ChartProps) {
  const [options, setOptions] = React.useState();
  const [data, setData] = React.useState();
  const [type, setType] = React.useState();

  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    if (!type || props.type !== type) {
      setType(props.type);
      setData(undefined);
    }
  }, [type, props.type, props.data]);

  useEffect(() => {
    if (!data || props.data !== data) {
      setData(props.data);
    }
  }, [props.data, props.type, data]);

  // useEffect(() => {
  //   if (
  //     !options ||
  //     props.color !== options.colors[0] ||
  //     props.labels !== options.dataLabels.enabled
  //   ) {
  //   }
  // }, [options, props.color, props.labels, props.lowerGauge, theme]);

  if (!options || !data || !type) return <div />;
  return (
    <div className={classes.root}>
      <LineChart
        height={140}
        width={240}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}

Chart.propTypes = {
  data: PropTypes.array.isRequired
};

export default Chart;
