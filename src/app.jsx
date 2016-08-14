import Simplex from "./react-simplex.js";
import { Router, Route, Link, browserHistory, IndexRoute  } from 'react-router'
import { RouteHandler } from 'react-router'


Simplex.set('NavBar');




var Nav = React.createClass({
    getInitialState() {
        return this.props;
    },

    render(){
        var menu = this.props.NavBar.map(( el, i )=>{
            return (<li key={i}><Link to={el.link}>{el.title}</Link> </li>)
        }) 
        return(
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">React Simplex Storage</a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li className="active"> <Link to={`/`}>Main</Link> </li>
                            <li> <Link to={`/about`}>About</Link> </li>
                            {menu}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});

Nav = SimplexConnect( Nav, ['NavBar'] );



var About = React.createClass({
    render: function() {
        return (
            <div>
                <h1>About</h1>
            </div>
            );
    }
});

var Main = React.createClass({
    render: function() {
        return (
            <div>
                <h1>Main</h1>
            </div>
            );
    }
});


var MainLayout = React.createClass({
    render: function() {
        return (
            <div>
                <Nav></Nav>
                {this.props.main}
            </div>
            );
    }
});



ReactDOM.render(
    <Router history={browserHistory} >
        <Route component={MainLayout}>
            <Route path="/" components={{main: Main}}/>
            <Route path="/about" components={{main: About}}/>
        </Route>
    </Router>, $('root')[0] ) 


/*

Simplex.NavBar = [{link: '/link', title: 'Nishtyak'}]

*/