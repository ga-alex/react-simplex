/* jshint esnext : true */

import React from 'react';

import { mount, shallow } from 'enzyme';
import {expect} from 'chai';

import { Simplex, SimplexConnect, SimplexMapToProps, Storage } from '../src/react-simplex.js';

const defaults = {
  renderCount: {
    a:0,
    b:0,
    c:0
  }
};

let testsUtils = JSON.parse(JSON.stringify(defaults));


const resetData = ()=>{
    Simplex.data1 = '';
    Simplex.data2 = '';
    Simplex.data3 = '';
};

const resetRenderCount = ( cleanData = true )=>{
  let _def = JSON.parse(JSON.stringify(defaults));
  testsUtils.renderCount = _def.renderCount;
};





var jsdom = require('jsdom');
const { JSDOM } = jsdom;
global.window = (new JSDOM('')).window;
global.document = global.window.document;



//Simplex.setStorageDriver( AsyncStorage, true )
Simplex.init('data1', '', false);
Simplex.init('data2', '', false);
Simplex.init('data3', '', true);




class ComponentA extends React.Component{
  constructor(){
    super();

    testsUtils.getPropsComponentA = ()=>{
      return this.props;
    };
  }
  render(){
    testsUtils.renderCount.a++;
    return (
      <div>hello</div>
    );
  }
}
const Component_conected = SimplexConnect( ComponentA, ['data1', 'data2'] );


class ComponentB extends React.Component{
  constructor(){
    super();

    testsUtils.getPropsComponentB = ()=>{
      return this.props;
    };
  }
  render(){
    testsUtils.renderCount.b++;
    return (
      <div>hello</div>
    );
  }
}
const Component_mapped = SimplexMapToProps( ComponentB );

class ComponentC extends React.Component{
  constructor(){
    super();

    testsUtils.getPropsComponentC = ()=>{
      return this.props;
    };
  }
  render(){
    testsUtils.renderCount.c++;
    return (
      <div>hello</div>
    );
  }
}
const Component_mapped_custom = SimplexMapToProps( ComponentC, ( storage, current_props )=>{
    return {
        data1: storage.data1,
        data3: storage.data3
    };
});


class Container extends React.Component{
  constructor(){
    super();
  }
  render(){
    return (
      <div>
        <Component_conected/>
        <Component_mapped/>
        <Component_mapped_custom/>
      </div>
    );
  }
}




const container = mount(<Container/>);



describe('Empty Simplex', ()=>{
  describe('Initial mount', function () {

    it("ComponentA props should be { data1: '', data2: '' }", function () {
      expect( testsUtils.getPropsComponentA() ).to.deep.equal({ data1: '', data2: '' });
    });

    it("ComponentB props should be { data1: '', data2: '', data3: '' }", function () {
      expect( testsUtils.getPropsComponentB() ).to.deep.equal({ data1: '', data2: '', data3: '' });
    });

    it("ComponentC props should be { data1: '', data3: '' }", function () {
      expect( testsUtils.getPropsComponentC() ).to.deep.equal({ data1: '', data3: '' });
    });

    it("Render count should be A=1, B=1, C=1", function () {
      expect( testsUtils.renderCount ).to.deep.equal({a:1,b:1,c:1});
    });
  });



  describe('Simplex.data1 = "test"', function () {
    before(function() {
      resetRenderCount()
      Simplex.data1 = 'test';
    });

    it("ComponentA props should be { data1: 'test', data2: '' }", function () {
      expect( testsUtils.getPropsComponentA() ).to.deep.equal({ data1: 'test', data2: '' });
    });

    it("ComponentB props should be { data1: 'test', data2: '', data3: '' }", function () {
      expect( testsUtils.getPropsComponentB() ).to.deep.equal({ data1: 'test', data2: '', data3: '' });
    });

    it("ComponentC props should be { data1: 'test', data3: '' }", function () {
      expect( testsUtils.getPropsComponentC() ).to.deep.equal({ data1: 'test', data3: '' });
    });

    it("Render count should be A=1, B=1, C=1", function () {
      expect( testsUtils.renderCount ).to.deep.equal({a:1,b:1,c:1});
    });
  });




  describe('Change Simplex.data1 to curently equal Simplex.data1 = "test"', function () {

    before(function() {
      resetRenderCount()
      Simplex.data1 = 'test';
    });

    it("ComponentA props should be { data1: 'test', data2: '' }", function () {
      expect( testsUtils.getPropsComponentA() ).to.deep.equal({ data1: 'test', data2: '' });
    });

    it("ComponentB props should be { data1: 'test', data2: '', data3: '' }", function () {
      expect( testsUtils.getPropsComponentB() ).to.deep.equal({ data1: 'test', data2: '', data3: '' });
    });

    it("ComponentC props should be { data1: 'test', data3: '' }", function () {
      expect( testsUtils.getPropsComponentC() ).to.deep.equal({ data1: 'test', data3: '' });
    });

    it("Render count should be A=0, B=0, C=0, without any unnecesary renders", function () {
      expect( testsUtils.renderCount ).to.deep.equal({a:0,b:0,c:0});
    });
  });


  describe('Simplex.data2 = "test"', function () {
    before(function() {
      resetData()
      resetRenderCount()
      Simplex.data2 = 'test';
    });

    it("ComponentA props should be { data1: '', data2: 'test' }", function () {
      expect( testsUtils.getPropsComponentA() ).to.deep.equal({ data1: '', data2: 'test' });
    });

    it("ComponentB props should be { data1: '', data2: 'test', data3: '' }", function () {
      expect( testsUtils.getPropsComponentB() ).to.deep.equal({ data1: '', data2: 'test', data3: '' });
    });

    it("ComponentC props should be { data1: '', data3: '' }", function () {
      expect( testsUtils.getPropsComponentC() ).to.deep.equal({ data1: '', data3: '' });
    });

    it("Render count should be A=1, B=1, C=0", function () {
      expect( testsUtils.renderCount ).to.deep.equal({a:1,b:1,c:0});
    });
  });





  describe('Simplex.data3 = "test"', function () {

    before(function() {
      resetData()
      resetRenderCount()
      Simplex.data3 = 'test';
    });

    it("ComponentA props should be { data1: '', data2: '' }", function () {
      expect( testsUtils.getPropsComponentA() ).to.deep.equal({ data1: '', data2: '' });
    });

    it("ComponentB props should be { data1: '', data2: '', data3: 'test' }", function () {
      expect( testsUtils.getPropsComponentB() ).to.deep.equal({ data1: '', data2: '', data3: 'test' });
    });

    it("ComponentC props should be { data1: '', data3: 'test' }", function () {
      expect( testsUtils.getPropsComponentC() ).to.deep.equal({ data1: '', data3: 'test' });
    });

    it("Render count should be A=0, B=1, C=1", function () {
      expect( testsUtils.renderCount ).to.deep.equal({a:0,b:1,c:1});
    });
  });
})




let container2 = null;
describe("Simlex already have state = {data1:'data1',data2: 'data2', data2: null}", function () {

  describe('Initial mount', function () {
    before(function() {
      Simplex.data1 = 'data1';
      Simplex.data2 = 'data2';
      Simplex.data3 = null;
      resetRenderCount()
      container2 = mount(<Container/>);
    });

    it("ComponentA props should be { data1: 'data1', data2: 'data2' }", function () {
      expect( testsUtils.getPropsComponentA() ).to.deep.equal({ data1: 'data1', data2: 'data2' });
    });

    it("ComponentB props should be { data1: 'data1', data2: 'data2', data3: null }", function () {
      expect( testsUtils.getPropsComponentB() ).to.deep.equal({ data1: 'data1', data2: 'data2', data3: null });
    });

    it("ComponentC props should be { data1: 'data1', data3: null }", function () {
      expect( testsUtils.getPropsComponentC() ).to.deep.equal({ data1: 'data1', data3: null });
    });

    it("Render count should be A=1, B=1, C=1", function () {
      expect( testsUtils.renderCount ).to.deep.equal({a:1,b:1,c:1});
    });
  });



});




describe("Test trigger", function () {

  describe('Simplex not changed. Render count after Simplex.trigger() should be A=0, B=0, C=0', function () {
    before(function() {
      Simplex.data1 = 'data1';
      Simplex.data2 = 'data2';
      Simplex.data3 = null;
      resetRenderCount();
      Simplex.trigger();
    });

    it("ComponentA props should be { data1: 'data1', data2: 'data2' }", function () {
      expect( testsUtils.getPropsComponentA() ).to.deep.equal({ data1: 'data1', data2: 'data2' });
    });

    it("ComponentB props should be { data1: 'data1', data2: 'data2', data3: null }", function () {
      expect( testsUtils.getPropsComponentB() ).to.deep.equal({ data1: 'data1', data2: 'data2', data3: null });
    });

    it("ComponentC props should be { data1: 'data1', data3: null }", function () {
      expect( testsUtils.getPropsComponentC() ).to.deep.equal({ data1: 'data1', data3: null });
    });

    it("Render count should be A=0, B=0, C=0", function () {
      expect( testsUtils.renderCount ).to.deep.equal({a:0,b:0,c:0});
    });
  });



});
/*

describe("Test trigger", function () {
	before(function() {
      //Simplex.reset()
      resetRenderCount();
      Simplex.trigger();
    });

	it("should be true", function () {
      expect( testsUtils.getPropsComponentA() ).to.deep.equal( { data1: null, data2: null, data3: null });
    });

	it("should be true", function () {
      expect( testsUtils.getPropsComponentB() ).to.deep.equal( { data1: null, data2: null, data3: null });
    });

	it("should be true", function () {
      expect( testsUtils.getPropsComponentC() ).to.deep.equal( { data1: null, data2: null, data3: null });
    });

});
*/
