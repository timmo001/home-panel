// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Chart from 'react-apexcharts';

const useStyles = makeStyles((_theme: Theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
}));

interface GraphProps {
  series: [
    {
      name: string;
      data: number[];
    }
  ];
}

const options = {
  chart: {
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  legend: {
    show: false
  }
};

function Graph(props: GraphProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Chart options={options} series={props.series} type="area" />
    </div>
  );
}

Graph.propTypes = {
  card: PropTypes.any.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default Graph;
