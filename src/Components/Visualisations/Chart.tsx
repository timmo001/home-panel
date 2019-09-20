// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Chart from 'react-apexcharts';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: -38,
    left: theme.spacing(-1),
    right: theme.spacing(-1)
  }
}));

interface ChartProps {
  color?: string;
  series: [
    {
      data: number[];
    }
  ];
}

function Chart(props: ChartProps) {
  const options = {
    chart: {
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: [props.color || '#607D8B'],
    dataLabels: {
      enabled: false
    },
    grid: {
      show: false,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    legend: {
      show: false
    },
    stroke: {
      curve: 'smooth',
      lineCap: 'butt',
      width: 3
    },
    tooltip: {
      enabled: false
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        show: false
      },
      labels: {
        show: false
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        show: false
      },
      labels: {
        show: false
      }
    }
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Chart
        height="100%"
        options={options}
        series={props.series}
        type="line"
      />
    </div>
  );
}

Chart.propTypes = {
  color: PropTypes.string.isRequired,
  series: PropTypes.array.isRequired
};

export default Chart;
