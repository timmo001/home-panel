import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';
import brown from '@material-ui/core/colors/brown';
import common from '@material-ui/core/colors/common';
import cyan from '@material-ui/core/colors/cyan';
import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import indigo from '@material-ui/core/colors/indigo';
import lightBlue from '@material-ui/core/colors/lightBlue';
import lightGreen from '@material-ui/core/colors/lightGreen';
import lime from '@material-ui/core/colors/lime';
import orange from '@material-ui/core/colors/orange';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import teal from '@material-ui/core/colors/teal';
import yellow from '@material-ui/core/colors/yellow';

const mapToColor = (str) => {
    if (str.startsWith('url')) return str;
    if (str.startsWith('#')) return str;
    var strRef = undefined;
    if (str.includes('[')) {
        const bracketIndex = str.indexOf('[');
        strRef = str.substr(bracketIndex + 1, (str.indexOf(']') - 1) - bracketIndex);
        str = str.substr(0, bracketIndex);
    }
    var color;
    switch (str) {
        default: color = str; break;
        case 'amber': color = amber; break;
        case 'blue': color = blue; break;
        case 'blueGrey': color = blueGrey; break;
        case 'brown': color = brown; break;
        case 'common': color = common; break;
        case 'cyan': color = cyan; break;
        case 'deepOrange': color = deepOrange; break;
        case 'deepPurple': color = deepPurple; break;
        case 'green': color = green; break;
        case 'grey': color = grey; break;
        case 'indigo': color = indigo; break;
        case 'lightBlue': color = lightBlue; break;
        case 'lightGreen': color = lightGreen; break;
        case 'lime': color = lime; break;
        case 'orange': color = orange; break;
        case 'pink': color = pink; break;
        case 'purple': color = purple; break;
        case 'red': color = red; break;
        case 'teal': color = teal; break;
        case 'yellow': color = yellow; break;
    }
    if (strRef) color = color[strRef];
    return color;
};

export default mapToColor;
