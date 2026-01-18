from services.usgs_live_service import fetch_live_usgs_data

result = fetch_live_usgs_data("01646500", "pH")
print(result)
