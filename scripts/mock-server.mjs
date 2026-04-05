import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, '..', 'mock', 'users.json')
const port = 3001

function jsonResponse(payload, init = {}) {
  const headers = new Headers(init.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  headers.set('Content-Type', 'application/json; charset=utf-8')

  return new Response(JSON.stringify(payload), {
    ...init,
    headers,
  })
}

function emptyResponse(status = 204) {
  return new Response(null, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

async function readUsers() {
  const fileContent = await readFile(dbPath, 'utf8')
  return JSON.parse(fileContent)
}

async function writeUsers(users) {
  await writeFile(dbPath, JSON.stringify(users, null, 2) + '\n', 'utf8')
}

function normalizePagination(searchParams) {
  const page = Number(searchParams.get('page') || '1')
  const limit = Number(searchParams.get('limit') || '40')

  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: Number.isInteger(limit) && limit > 0 ? limit : 40,
  }
}

function normalizeSearch(searchParams) {
  return (searchParams.get('search') || '').trim().toLowerCase()
}

const server = Bun.serve({
  port,
  async fetch(request) {
    try {
      const url = new URL(request.url)

      if (request.method === 'OPTIONS') {
        return emptyResponse()
      }

      if (request.method === 'GET' && url.pathname === '/api/users') {
        const users = await readUsers()
        const { page, limit } = normalizePagination(url.searchParams)
        const search = normalizeSearch(url.searchParams)
        const filteredUsers = search
          ? users.filter((user) => {
              const haystack = `${user.full_name} ${user.email}`.toLowerCase()
              return haystack.includes(search)
            })
          : users

        const startIndex = (page - 1) * limit
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit)

        return jsonResponse({
          data: paginatedUsers,
          meta: {
            total: filteredUsers.length,
            page,
            limit,
          },
        })
      }

      const userIdMatch = url.pathname.match(/^\/api\/users\/(\d+)$/)

      if (request.method === 'GET' && userIdMatch) {
        const users = await readUsers()
        const userId = Number(userIdMatch[1])
        const user = users.find((item) => item.id === userId)

        if (!user) {
          return jsonResponse({ message: 'User not found.' }, { status: 404 })
        }

        return jsonResponse(user)
      }

      if (request.method === 'POST' && url.pathname === '/api/users') {
        const users = await readUsers()
        const body = await request.json()
        const nextId = users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1
        const nextUser = {
          id: nextId,
          full_name: String(body.full_name || '').trim(),
          email: String(body.email || '').trim(),
          status: body.status === 'blocked' ? 'blocked' : 'active',
          registered_at: new Date().toISOString(),
        }

        users.unshift(nextUser)
        await writeUsers(users)
        return jsonResponse(nextUser, { status: 201 })
      }

      if (request.method === 'PATCH' && userIdMatch) {
        const users = await readUsers()
        const body = await request.json()
        const userId = Number(userIdMatch[1])
        const userIndex = users.findIndex((item) => item.id === userId)

        if (userIndex === -1) {
          return jsonResponse({ message: 'User not found.' }, { status: 404 })
        }

        const currentUser = users[userIndex]
        const updatedUser = {
          ...currentUser,
          full_name: body.full_name !== undefined ? String(body.full_name).trim() : currentUser.full_name,
          email: body.email !== undefined ? String(body.email).trim() : currentUser.email,
          status:
            body.status === 'active' || body.status === 'blocked' ? body.status : currentUser.status,
        }

        users[userIndex] = updatedUser
        await writeUsers(users)
        return jsonResponse(updatedUser)
      }

      return jsonResponse({ message: 'Route not found.' }, { status: 404 })
    } catch (error) {
      console.error(error)
      return jsonResponse({ message: 'Internal server error.' }, { status: 500 })
    }
  },
})

console.log(`Mock API is running at ${server.url}`)