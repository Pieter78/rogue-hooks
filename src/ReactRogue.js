import React, { useRef, useEffect, useState } from 'react'
import InputManager from './InputManager'
import World from './World'
import Spawner from './Spawner'

const ReactRogue = ({ width, height, tileSize }) => {
  const canvasRef = useRef()

  // const [player, setPlayer] = useState(new Player(1, 2, tileSize))
  const [world, setWorld] = useState(new World(width, height, tileSize))

  let inputManager = new InputManager()

  const handleInput = (action, data) => {
    console.log(`Handle input: ${action}:${JSON.stringify(data)}`)

    // shallow copy
    let newWorld = new World()

    // copy player
    Object.assign(newWorld, world)
    newWorld.movePlayer(data.x, data.y)
    setWorld(newWorld)
  }

  useEffect(() => {
    console.log('Create Map')
    // shallow copy
    let newWorld = new World()

    // copy player
    Object.assign(newWorld, world)
    newWorld.createCellularMap()
    newWorld.moveToSpace(world.player)

    let spawner = new Spawner(newWorld)
    spawner.spawnLoot(10)
    spawner.spawnMonsters(6)
    spawner.spawnStairs()

    setWorld(newWorld)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log('Bind input')

    inputManager.bindKeys()
    inputManager.subscribe(handleInput)

    // gets called when component gets closed
    return () => {
      inputManager.unbindKeys()
      inputManager.unsubscribe(handleInput)
    }
  })

  useEffect(() => {
    console.log('Draw to canvas')
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, width * tileSize, height * tileSize)
    world.draw(ctx)
  })

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width * tileSize}
        height={height * tileSize}
        style={{ border: '1px solid black', background: 'DimGray' }}
      />
      <ul>
        {world.player.inventory.map((item, index) => (
          <li key={index}>{item.attributes.name}</li>
        ))}
      </ul>
      <ul>
        {world.history.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </>
  )
}

export default ReactRogue
