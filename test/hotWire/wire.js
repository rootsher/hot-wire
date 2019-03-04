/* jshint mocha: true */
"use strict";

import chai from "chai";
import dirtyChai from "dirty-chai";

import HotWire from "../../src/HotWire";

chai.use(dirtyChai);

var expect = chai.expect;

describe("hotwire/HotWire", function() {
	describe("~wire", function(){
		it("wires containers", function() {
			function Foo(args){ this.foo = true; }
			let hW = new HotWire();

			return hW.wire({
				"services": {
					"fooClass": {
						"class": Foo,
						"public": true,
					},
					"fooFactory": {
						"factory": function() { return {"foo": true}; },
						"public": true,
					},
					"fooPlain": {
						"plainObject": {"foo": true},
						"public": true,
					},
				},
			}).then(function(wired) {
				expect(wired).to.have.all.keys(["fooClass", "fooFactory", "fooPlain"]);
				expect(wired.fooClass).to.be.instanceOf(Foo);
				expect(wired.fooFactory).to.have.property("foo", true);
				expect(wired.fooPlain).to.have.property("foo", true);
			});
		});

		it("wires containers with additional calls", function() {
			function Foo(args){ this.setFoo = ((foo) => this.foo = foo); }
			let hW = new HotWire();

			return hW.wire({
				"services": {
					"fooClass": {
						"class": Foo,
						"public": true,
					},
				},
				"calls": [
					{"service": "fooClass", "method": "setFoo", "arguments": ["foo"]},
				],
			}).then(function(wired) {
				expect(wired.fooClass).to.have.property("foo", "foo");
			});
		});
	});
});
