import { Node } from './node';
import { IGridConstructor, IPoint } from '../interfaces/astar.interfaces';

export class Grid {
  // General properties
  readonly width: number;
  readonly height: number;
  readonly numberOfFields: number;

  // The node grid
  private gridNodes: Node[][];

  constructor(aParams: IGridConstructor) {
    // Set the general properties
    if (aParams.width && aParams.height) {
      this.width = aParams.width;
      this.height = aParams.height;
      this.numberOfFields = this.width * this.height;
    } else if (aParams.matrix) {
      this.width = aParams.matrix[0].length;
      this.height = aParams.matrix.length;
      this.numberOfFields = this.width * this.height;
    }

    // Create and generate the matrix
    this.gridNodes = Grid.buildGridWithNodes(
      aParams.matrix || undefined,
      this.width,
      this.height,
      aParams.densityOfObstacles || 0
    );
  }

  /**
   * Build grid, fill it with nodes and return it.
   * @param matrix [ 0 to infinite: 0 = not walkable; 0.5 = half walk speed; 1 = normal walk speed; 2 = double walk speed ]
   * @param width [grid width]
   * @param height [grid height]
   * @param densityOfObstacles [density of non walkable fields]
   */
  private static buildGridWithNodes(
    matrix: number[][],
    width: number,
    height: number,
    densityOfObstacles?: number
  ): Node[][] {
    const newGrid: Node[][] = [];
    let id: number = 0;

    // Generate an empty matrix
    for (let y = 0; y < height; y++) {
      newGrid[y] = [];
      for (let x = 0; x < width; x++) {
        newGrid[y][x] = new Node({
          id: id,
          position: { x: x, y: y }
        });

        id++;
      }
    }

    /**
     * If we have not loaded a predefined matrix,
     * loop through our grid and set random obstacles.
     */
    if (matrix === undefined) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const rndNumber = Math.floor(Math.random() * 10) + 1;
          if (rndNumber > 10 - densityOfObstacles) {
            newGrid[y][x].setWalkSpeed(0);
          } else {
            newGrid[y][x].setWalkSpeed(1);
          }
        }
      }

      return newGrid;
    }

    /**
     * In case we have a matrix loaded.
     * Load up the informations of the matrix.
     */
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        newGrid[y][x].setWalkSpeed(matrix[y][x]);
      }
    }

    return newGrid;
  }

  /**
   * Return a specific node.
   * @param position [position on the grid]
   */
  public getNodeAt(position: IPoint): Node {
    return this.gridNodes[position.y][position.x];
  }

  /**
   * Check if specific node walkable.
   * @param position [position on the grid]
   */
  public isWalkableAt(position: IPoint): boolean {
    return this.gridNodes[position.y][position.x].getWalkSpeed() > 0;
  }

  /**
   * Check if specific node is on the grid.
   * @param position [position on the grid]
   */
  private isOnTheGrid(position: IPoint): boolean {
    return (
      position.x >= 0 &&
      position.x < this.width &&
      position.y >= 0 &&
      position.y < this.height
    );
  }

  /**
   * Get surrounding nodes.
   * @param currentPosition [position on the grid]
   * @param diagonalMovementAllowed [is diagonal movement allowed?]
   */
  public getSurroundingNodes(
    currentPosition: IPoint,
    diagonalMovementAllowed: boolean
  ): Node[] {
    const surroundingNodes: Node[] = [];

    for (let y = currentPosition.y - 1; y <= currentPosition.y + 1; y++) {
      for (let x = currentPosition.x - 1; x <= currentPosition.x + 1; x++) {
        if (this.isOnTheGrid({ x, y })) {
          if (this.isWalkableAt({ x, y })) {
            if (diagonalMovementAllowed) {
              surroundingNodes.push(this.getNodeAt({ x, y }));
            } else {
              if (x == currentPosition.x || y == currentPosition.y) {
                surroundingNodes.push(this.getNodeAt({ x, y }));
              }
            }
          }
        }
      }
    }

    return surroundingNodes;
  }

  public setGrid(newGrid: Node[][]): void {
    this.gridNodes = newGrid;
  }

  /**
   * Reset the grid
   */
  public resetGrid(): void {
    for (let y = 0; y < this.gridNodes.length; y++) {
      for (let x = 0; x < this.gridNodes[y].length; x++) {
        this.gridNodes[y][x].setIsOnClosedList(false);
        this.gridNodes[y][x].setIsOnOpenList(false);
        this.gridNodes[y][x].setParent(undefined);
        this.gridNodes[y][x].setFGHValuesToZero();
      }
    }
  }

  /**
   * Get all the nodes of the grid.
   */
  public getGridNodes(): Node[][] {
    return this.gridNodes;
  }

  /**
   * Get a clone of the grid
   */
  public clone(): Node[][] {
    const cloneGrid: Node[][] = [];
    let id: number = 0;

    for (let y = 0; y < this.height; y++) {
      cloneGrid[y] = [];
      for (let x = 0; x < this.width; x++) {
        cloneGrid[y][x] = new Node({
          id: id,
          position: { x: x, y: y },
          walkSpeed: this.gridNodes[y][x].getWalkSpeed()
        });

        id++;
      }
    }
    return cloneGrid;
  }
}
