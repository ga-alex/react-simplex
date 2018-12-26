/* jshint esnext : true */
import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Simplex, SimplexConnect, SimplexMapToProps, Storage } from '../src/react-simplex.js';

const defaults = {
  renderCount: {
    a: 0,
    b: 0,
    c: 0
  }
};

let testsUtils = JSON.parse(JSON.stringify(defaults));


const resetData = () => {
  Simplex.data1 = '';
  Simplex.data2 = '';
  Simplex.data3 = '';
};

const resetRenderCount = (cleanData = true) => {
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



class ComponentA extends React.Component {
  constructor() {
    super();

    testsUtils.getPropsComponentA = () => {
      return this.props;
    };
  }
  render() {
    testsUtils.renderCount.a++;
    return (
      <div>hello</div>
    );
  }
}
const Component_conected = SimplexConnect(ComponentA, ['data1', 'data2']);


class ComponentB extends React.Component {
  constructor() {
    super();

    testsUtils.getPropsComponentB = () => {
      return this.props;
    };
  }
  render() {
    testsUtils.renderCount.b++;
    return (
      <div>hello</div>
    );
  }
}
const Component_mapped = SimplexMapToProps(ComponentB);

class ComponentC extends React.Component {
  constructor() {
    super();

    testsUtils.getPropsComponentC = () => {
      return this.props;
    };
  }
  render() {
    testsUtils.renderCount.c++;
    return (
      <div>hello</div>
    );
  }
}
const Component_mapped_custom = SimplexMapToProps(ComponentC, (storage, current_props) => {
  return {
    data1: storage.data1,
    data3: storage.data3
  };
});


class Container extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <Component_conected />
        <Component_mapped />
        <Component_mapped_custom />
      </div>
    );
  }
}




const container = mount(<Container />);



describe('Empty Simplex', () => {
  describe('Initial mount', function () {

    it("ComponentA props should be { data1: '', data2: '' }", function () {
      expect(testsUtils.getPropsComponentA()).to.deep.equal({ data1: '', data2: '' });
    });

    it("ComponentB props should be { data1: '', data2: '', data3: '' }", function () {
      expect(testsUtils.getPropsComponentB()).to.deep.equal({ data1: '', data2: '', data3: '' });
    });

    it("ComponentC props should be { data1: '', data3: '' }", function () {
      expect(testsUtils.getPropsComponentC()).to.deep.equal({ data1: '', data3: '' });
    });

    it("Render count should be A=1, B=1, C=1", function () {
      expect(testsUtils.renderCount).to.deep.equal({ a: 1, b: 1, c: 1 });
    });
  });



  describe('Simplex.data1 = "test"', function () {
    before(function () {
      resetRenderCount()
      Simplex.data1 = 'test';
    });

    it("ComponentA props should be { data1: 'test', data2: '' }", function () {
      expect(testsUtils.getPropsComponentA()).to.deep.equal({ data1: 'test', data2: '' });
    });

    it("ComponentB props should be { data1: 'test', data2: '', data3: '' }", function () {
      expect(testsUtils.getPropsComponentB()).to.deep.equal({ data1: 'test', data2: '', data3: '' });
    });

    it("ComponentC props should be { data1: 'test', data3: '' }", function () {
      expect(testsUtils.getPropsComponentC()).to.deep.equal({ data1: 'test', data3: '' });
    });

    it("Render count should be A=1, B=1, C=1", function () {
      expect(testsUtils.renderCount).to.deep.equal({ a: 1, b: 1, c: 1 });
    });
  });




  describe('Change Simplex.data1 to curently equal Simplex.data1 = "test"', function () {

    before(function () {
      resetRenderCount()
      Simplex.data1 = 'test';
    });

    it("ComponentA props should be { data1: 'test', data2: '' }", function () {
      expect(testsUtils.getPropsComponentA()).to.deep.equal({ data1: 'test', data2: '' });
    });

    it("ComponentB props should be { data1: 'test', data2: '', data3: '' }", function () {
      expect(testsUtils.getPropsComponentB()).to.deep.equal({ data1: 'test', data2: '', data3: '' });
    });

    it("ComponentC props should be { data1: 'test', data3: '' }", function () {
      expect(testsUtils.getPropsComponentC()).to.deep.equal({ data1: 'test', data3: '' });
    });

    it("Render count should be A=0, B=0, C=0, without any unnecesary renders", function () {
      expect(testsUtils.renderCount).to.deep.equal({ a: 0, b: 0, c: 0 });
    });
  });


  describe('Simplex.data2 = "test"', function () {
    before(function () {
      resetData()
      resetRenderCount()
      Simplex.data2 = 'test';
    });

    it("ComponentA props should be { data1: '', data2: 'test' }", function () {
      expect(testsUtils.getPropsComponentA()).to.deep.equal({ data1: '', data2: 'test' });
    });

    it("ComponentB props should be { data1: '', data2: 'test', data3: '' }", function () {
      expect(testsUtils.getPropsComponentB()).to.deep.equal({ data1: '', data2: 'test', data3: '' });
    });

    it("ComponentC props should be { data1: '', data3: '' }", function () {
      expect(testsUtils.getPropsComponentC()).to.deep.equal({ data1: '', data3: '' });
    });

    it("Render count should be A=1, B=1, C=0", function () {
      expect(testsUtils.renderCount).to.deep.equal({ a: 1, b: 1, c: 0 });
    });
  });





  describe('Simplex.data3 = "test"', function () {

    before(function () {
      resetData()
      resetRenderCount()
      Simplex.data3 = 'test';
    });

    it("ComponentA props should be { data1: '', data2: '' }", function () {
      expect(testsUtils.getPropsComponentA()).to.deep.equal({ data1: '', data2: '' });
    });

    it("ComponentB props should be { data1: '', data2: '', data3: 'test' }", function () {
      expect(testsUtils.getPropsComponentB()).to.deep.equal({ data1: '', data2: '', data3: 'test' });
    });

    it("ComponentC props should be { data1: '', data3: 'test' }", function () {
      expect(testsUtils.getPropsComponentC()).to.deep.equal({ data1: '', data3: 'test' });
    });

    it("Render count should be A=0, B=1, C=1", function () {
      expect(testsUtils.renderCount).to.deep.equal({ a: 0, b: 1, c: 1 });
    });
  });
})




let container2 = null;
describe("Simlex already have state = {data1:'data1',data2: 'data2', data2: null}", function () {

  describe('Initial mount', function () {
    before(function () {
      Simplex.data1 = 'data1';
      Simplex.data2 = 'data2';
      Simplex.data3 = null;
      resetRenderCount()
      container2 = mount(<Container />);
    });

    it("ComponentA props should be { data1: 'data1', data2: 'data2' }", function () {
      expect(testsUtils.getPropsComponentA()).to.deep.equal({ data1: 'data1', data2: 'data2' });
    });

    it("ComponentB props should be { data1: 'data1', data2: 'data2', data3: null }", function () {
      expect(testsUtils.getPropsComponentB()).to.deep.equal({ data1: 'data1', data2: 'data2', data3: null });
    });

    it("ComponentC props should be { data1: 'data1', data3: null }", function () {
      expect(testsUtils.getPropsComponentC()).to.deep.equal({ data1: 'data1', data3: null });
    });

    it("Render count should be A=1, B=1, C=1", function () {
      expect(testsUtils.renderCount).to.deep.equal({ a: 1, b: 1, c: 1 });
    });
  });



});




describe("Test trigger", function () {

  describe('Simplex not changed. Render count after Simplex.trigger() should be A=0, B=0, C=0', function () {
    before(function () {
      Simplex.data1 = 'data1';
      Simplex.data2 = 'data2';
      Simplex.data3 = null;
      resetRenderCount();
      Simplex.trigger();
    });

    it("ComponentA props should be { data1: 'data1', data2: 'data2' }", function () {
      expect(testsUtils.getPropsComponentA()).to.deep.equal({ data1: 'data1', data2: 'data2' });
    });

    it("ComponentB props should be { data1: 'data1', data2: 'data2', data3: null }", function () {
      expect(testsUtils.getPropsComponentB()).to.deep.equal({ data1: 'data1', data2: 'data2', data3: null });
    });

    it("ComponentC props should be { data1: 'data1', data3: null }", function () {
      expect(testsUtils.getPropsComponentC()).to.deep.equal({ data1: 'data1', data3: null });
    });

    it("Render count should be A=0, B=0, C=0", function () {
      expect(testsUtils.renderCount).to.deep.equal({ a: 0, b: 0, c: 0 });
    });
  });

});

//Fro check reset method
const RESET1 = {
  name: 'Reset 1 default'
}

const RESET2 = {
  name: 'Reset 2 default'
}

const RESET1NEW = {
  name: 'Reset 1 new'
}

const RESET2NEW = {
  name: 'Reset 2 new'
}




describe("Test reset #1, reset exact storage", function () {
  describe('Reset reset_1_test storage', function () {
    before(function () {
      Simplex.init('reset_1_test', RESET1, false);
      Simplex.init('reset_2_test', RESET2, false);
      Simplex.reset_1_test = RESET1NEW;
      Simplex.reset_2_test = RESET2NEW;
      Simplex.reset('reset_1_test');
    });

    it("reset_1_test should be default: " + JSON.stringify(RESET1), function () {
      expect(Simplex.reset_1_test).to.deep.equal(RESET1);
    });

    it("reset_2_test should be without changes: " + JSON.stringify(RESET2NEW), function () {
      expect(Simplex.reset_2_test).to.deep.equal(RESET2NEW);
    });
  });
});



describe("Test reset #2, reset all storages", function () {
  describe('Reset all storages', function () {
    before(function () {
      Simplex.reset_1_test = RESET1NEW;
      Simplex.reset_2_test = RESET2NEW;
      Simplex.reset();
    });

    it("reset_1_test should be default: " + JSON.stringify(RESET1), function () {
      expect(Simplex.reset_1_test).to.deep.equal(RESET1);
    });

    it("reset_2_test should be default: " + JSON.stringify(RESET2), function () {
      expect(Simplex.reset_2_test).to.deep.equal(RESET2);
    });
  });
});

const ARRAY_INITIAL = [1,2,3]
const ARRAY_NEW = [4,5,6]

describe("Test update", function () {
  describe('update array storage', function () {
    before(function () {
      Simplex.init('array', ARRAY_INITIAL);
      Simplex.update('array', ARRAY_NEW)
    });

    it("array should be updated: " + JSON.stringify(ARRAY_NEW), function () {
      expect(Simplex.array).to.deep.equal(ARRAY_NEW);
    });
  });
});

describe("Test reset array storage", function () {
  describe(`Simplex.reset('array') array storage`, function () {
    before(function () {
      Simplex.reset('array');
    });

    it("array should be initial: " + JSON.stringify(ARRAY_INITIAL), function () {
      expect(Simplex.array).to.deep.equal(ARRAY_INITIAL);
    });
  });
});