import React, { useState, useEffect } from 'react'
import {
  Avatar,
  Input,
  List,
  ListItem,
  ListItemPrefix,
  Popover,
  PopoverContent,
  PopoverHandler,
  Rating
} from '@material-tailwind/react'
import axios from 'axios'
import { Server } from '../../shared/interfaces/server.interface'
import { UrlsConstant } from '../../shared/constants/urls.constant'
import { Badge, Button } from 'react-daisyui'
import { getPingIcon } from '../utils/icons.util'
import { CiCircleMore } from 'react-icons/ci'
import { IoRemoveCircleOutline, IoAddCircleOutline, IoReload } from 'react-icons/io5'
import { FiCopy } from 'react-icons/fi'

let STORED_SERVERS: Server[] = []
export function ExplorePage() {
  const TABLE_HEAD = ['Name', 'Tags', 'Ping', 'options']
  const [loading, setLoading] = useState<boolean>(true)
  const [TABLE_ROWS, SetTableRow] = useState<Server[]>([])
  const [storeServers, setStoreServers] = useState<Server[]>([])

  const requestHandler = async (url: string): Promise<Server[]> => {
    try {
      const res = await axios.get<Server[]>(url)
      return res.data
    } catch (err) {
      return []
    }
  }

  const updateHandler = async () => {
    let data = await requestHandler(UrlsConstant.STORE_SERVER)
    if (data.length === 0) {
      data = await requestHandler(UrlsConstant.STORE)
    }

    const servers: Server[] = await Promise.all(
      data.map(async server => {
        const res = await window.ipc.ping(server)
        server.ping = Number(res.data.time) || -1
        SetTableRow(prevState => [...prevState, server])
        return server
      })
    )

    servers.sort((a, b) => (a.ping === -1 ? 1 : b.ping === -1 ? -1 : a.ping - b.ping))
    SetTableRow(servers)
    STORED_SERVERS = servers
  }
  const fetchDnsList = async () => {
    try {
      SetTableRow([])
      setLoading(true)
      const response = await window.ipc.fetchDnsList()
      setStoreServers(response.servers)
      await updateHandler()
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchDnsList()
  }, [])

  function onSearchHandler(event: React.ChangeEvent<HTMLInputElement>) {
    console.log('searching', event.target.value)
    const value = event.target.value
    if (value === '') {
      SetTableRow(STORED_SERVERS)
      return
    }
    const filtered = STORED_SERVERS.filter(server => {
      let regex = new RegExp(value, 'i')
      if (server.name.toLowerCase().match(regex)) {
        return server
      }
      if (server.tags.includes(value)) {
        return server
      }
    })

    if (filtered.length === 0) {
      SetTableRow([])
      return
    }

    SetTableRow(filtered)
  }

  return (
    <div className="hero flex flex-col justify-center items-center p-5">
      <div className="flex flex-col items-start gap-4 py-0 ">
        <div className="dark:bg-[#262626] bg-base-200 px-2 rounded-lg shadow w-[670px] h-[320px] overflow-auto overflow-y-auto">
          {/*search & and loading */}
          <div className="flex flex-row justify-between items-center p-2 mt-2">
            {/*  search bar */}
            <div className="flex flex-row gap-2">
              <Input
                type={'text'}
                color="indigo"
                className={'dark:text-gray-400'}
                label={'Search'}
                name={'search'}
                crossOrigin
                disabled={loading}
                onChange={onSearchHandler}
              />
            </div>
            {/*  loading */}

            <div className="flex flex-row justify-center items-center  px-2 gap-1">
              {loading && <span className="loading loading-ring loading-xs mr-3"></span>}
              {/*  refresh btn*/}
              <Button size={'sm'} shape="circle" disabled={loading} onClick={() => fetchDnsList()}>
                <IoReload size={20} className={'dark:text-gray-400 text-gray-800'} />
              </Button>
            </div>
          </div>
          <table className=" w-full min-w-max table-auto  text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map(head => (
                  <th key={head} className="  p-4">
                    <p className="font-normal leading-none opacity-70">{head}</p>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {TABLE_ROWS.map((server, index) => {
                const isLast = index === TABLE_ROWS.length - 1
                const classes = isLast ? 'p-4' : 'p-4 border-b border-gray-400 rounded dark:border-gray-800'
                return (
                  <ServerTrComponent
                    server={server}
                    classes={classes}
                    storeServers={storeServers}
                    setStoreServer={setStoreServers}
                    key={server.key}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

interface Prop {
  server: Server
  classes: string
  storeServers: Server[]
  setStoreServer: any
}

function ServerTrComponent(prop: Prop) {
  const { avatar, name, key, servers, tags, rate } = prop.server
  const ping = prop.server.ping
  console.log(ping)
  const storeServers = prop.storeServers
  const ratingValue = Number((rate / 2).toFixed())

  async function DeleteHandler() {
    const response = await window.ipc.deleteDns(prop.server)
    if (response.success) {
      prop.setStoreServer(response.servers)
    }
  }

  async function AddToListHandler() {
    const response = await window.ipc.addDns(prop.server)
    if (response.success) {
      prop.setStoreServer(response.servers)
    }
  }

  return (
    <tr>
      <td className={prop.classes}>
        <div className="flex items-center gap-3  p-2  rounded-2xl dark:bg-gray-900 bg-gray-300">
          <Avatar
            src={`./servers-icon/${avatar}`}
            alt={name}
            size="xs"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = './servers-icon/def.png'
            }}
          />
          <div className="flex flex-col">
            <p className="font-normal text-sm dark:text-white truncate w-32 opacity-70">{name}</p>
          </div>
        </div>
      </td>

      <td className={prop.classes}>
        <div className={'grid grid-cols-1 gap-2 h-10 overflow-auto'}>
          {tags.map(tag => {
            return (
              <Badge
                size={'xs'}
                className="text-xs  text-gray-600 dark:text-gray-500 truncate p-2
                dark:border-gray-800 border-gray-300"
                variant={'outline'}>
                {tag}
              </Badge>
            )
          })}
        </div>
      </td>
      <td className={prop.classes}>
        <div className="w-max flex flex-row gap-2 opacity-70">
          <span className={'mt-1'}>{getPingIcon(ping)}</span>
          <p className="text-md"> {!Number(ping) ? -1 : ping}</p>
        </div>
      </td>
      <td className={prop.classes}>
        <div className="flex flex-row gap-2">
          {storeServers.find(ser => ser.key == key) ? (
            <Button
              size={'xs'}
              shape="circle"
              className={
                'normal-case bg-[#a5242485] hover:bg-[#891717d1] text-gray-100 dark:text-gray-400 border-none font-light'
              }
              onClick={DeleteHandler}>
              <IoRemoveCircleOutline size={20} />
            </Button>
          ) : (
            <Button
              size={'xs'}
              shape="circle"
              className="normal-case bg-[#3fa67573] hover:bg-[#2d9d67d1] hover:text-white font-light text-gray-100 dark:text-gray-400 border-none text-opacity-80"
              onClick={AddToListHandler}>
              <IoAddCircleOutline size={20} />
            </Button>
          )}
          <Popover placement="top-start">
            <PopoverHandler>
              <Button
                size={'xs'}
                shape="circle"
                className="normal-case bg-[#555b5873] hover:bg-[#36383773] hover:text-white font-light text-gray-100 dark:text-gray-400 border-none text-opacity-80">
                <CiCircleMore size={20} />
              </Button>
            </PopoverHandler>
            <PopoverContent
              draggable={false}
              className="w-72 dark:bg-[#272727] dark:border-gray-700 dark:shadow-md shadow-lg border-none">
              <List className="p-0 dark:text-gray-400">
                <a href="#" className="text-initial w-60">
                  <ListItem className={'text-xs'} onClick={event => navigator.clipboard.writeText(servers.join(','))}>
                    <ListItemPrefix>
                      <FiCopy />
                    </ListItemPrefix>
                    {servers.join(' , ')}
                  </ListItem>
                </a>
                <a href="#" className="text-initial w-60">
                  <ListItem
                    className={'text-xs cursor-default'}
                    onClick={event => navigator.clipboard.writeText(servers.join(','))}>
                    <ListItemPrefix>Rate</ListItemPrefix>
                    <Rating className={'cursor-default'} value={ratingValue} readonly={true} />
                  </ListItem>
                </a>
              </List>
            </PopoverContent>
          </Popover>
        </div>
      </td>
    </tr>
  )
}
