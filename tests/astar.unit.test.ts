import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import { AStarFinder } from '../lib/finders/astar-finder';

@suite
class AStarUnitTests {

  @test 'given scenario from readme, when matrix is used, then path is found'() {
    let myMatrix = [
      [7, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 1, 0, 0, 1],
      [1, 1, 0, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 1],
      [0, 0, 0, 1, 7, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 0, 1],
      [1, 1, 0, 1, 1, 1, 1, 1]
    ];

    let aStarInstance = new AStarFinder({
      grid: {
        matrix: myMatrix
      }
    });

    const gridNodes = aStarInstance.getGrid().getGridNodes();
    expect(gridNodes.length).to.equal(myMatrix.length);
    expect(gridNodes[0].length).to.equal(myMatrix[0].length);
    const speedMap = gridNodes.map(r => r.map(n => n.getWalkSpeed()));
    expect(speedMap).to.deep.equal(myMatrix);

    let startPos = { x: 0, y: 0 };
    let goalPos = { x: 4, y: 5 };

    let myPathway = aStarInstance.findPath(startPos, goalPos);
    expect(myPathway.length).to.equal(8);
    expect(myPathway[0]).to.deep.equal([0, 0]);
    expect(myPathway[1]).to.deep.equal([1, 1]);
    expect(myPathway[2]).to.deep.equal([2, 1]);
    expect(myPathway[3]).to.deep.equal([3, 1]);
    expect(myPathway[4]).to.deep.equal([4, 2]);
    expect(myPathway[5]).to.deep.equal([4, 3]);
    expect(myPathway[6]).to.deep.equal([4, 4]);
    expect(myPathway[7]).to.deep.equal([4, 5]);
  }

  @test 'given scenario with fast lane, when matrix is used, then fastest path is found'() {
    let myMatrix = [
      [7, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 7, 0, 0, 1, 0, 0, 1],
      [1, 7, 0, 1, 1, 1, 0, 1],
      [1, 7, 1, 1, 1, 1, 0, 1],
      [0, 7, 0, 1, 7, 1, 0, 1],
      [1, 7, 7, 7, 7, 1, 0, 1],
      [1, 1, 0, 1, 1, 1, 1, 1]
    ];

    let aStarInstance = new AStarFinder({
      grid: {
        matrix: myMatrix
      },
      // weight: 0
    });

    const gridNodes = aStarInstance.getGrid().getGridNodes();
    expect(gridNodes.length).to.equal(myMatrix.length);
    expect(gridNodes[0].length).to.equal(myMatrix[0].length);
    const speedMap = gridNodes.map(r => r.map(n => n.getWalkSpeed()));
    expect(speedMap).to.deep.equal(myMatrix);

    let startPos = { x: 0, y: 0 };
    let goalPos = { x: 4, y: 5 };

    let myPathway = aStarInstance.findPath(startPos, goalPos);
    console.log(myPathway);
  }

}
