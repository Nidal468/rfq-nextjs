import connectMongo from "@/db/mongoose"
import { SupplierModel } from "@/model/supplier"

export async function POST(req: Request) {
  try {
    await connectMongo()

    const data = await req.json()

    const supplier = await SupplierModel.create(data)

    return Response.json({
      success: true,
      data: supplier
    })
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to create supplier" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    await connectMongo()

    const { searchParams } = new URL(req.url)

    const naics = searchParams.get("naics")
    const psc = searchParams.get("psc")
    const agency = searchParams.get("agency")

    const limit = Number(searchParams.get("limit")) || 20
    const page = Number(searchParams.get("page")) || 1

    const query: any = {}

    if (naics) query.naicsCode = naics
    if (psc) query.pscCode = psc
    if (agency) query.agency = agency

    const suppliers = await SupplierModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    return Response.json({
      success: true,
      count: suppliers.length,
      data: suppliers
    })
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch suppliers" },
      { status: 500 }
    )
  }
}