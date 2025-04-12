import numpy as np
import tabula
import pandas as pd
from pathlib import Path

# Get current folder
current_folder = Path(__file__).parent

input_path = current_folder / "danh_sach_hoc_vien.pdf"

input_path = input_path.resolve()

dfs = tabula.read_pdf(input_path, pages="all", pandas_options= {'dtype': str}, multiple_tables=True)

column_info = {
    "TT": ('int', "id"),
    "Họ và tên": ('string', "name"),
    "Giới\rtính": ('string', "gender"),
    "Quốc tịch": ('string', "nationality"),
    "Hạng": ('string', "class"),
    "Số GPLX": ('string', "license_number"),
    "Mã khóa học": ('string', "class_code"),
    "Ngày khai\rgiảng": ("datetime64[D]", "start_date"),
    "Ngày bế\rgiảng": ("datetime64[D]", "end_date")
}

combined_dfs = []

# Process the first PDF (pdf[0])
if len(dfs) > 0:
    pdf = dfs[0].copy()
    pdf = pdf.iloc[2:]  # Remove rows 0 and 1
    pdf.columns = list(column_info.keys())[:len(pdf.columns)] # Rename columns by index
    combined_dfs.append(pdf)


for pdf in dfs[1:]:
    pdf = pdf[list(column_info.keys())]
    combined_dfs.append(pdf)

final_df_list = []
for pdf in combined_dfs:
  # Force cast the type of each column
  for col_name, (col_type, new_col_name) in column_info.items():
    if col_name in pdf.columns:
        if col_type == "datetime64[D]":
            try:
                pdf[col_name] = pd.to_datetime(pdf[col_name], format="%d/%m/%Y", errors='coerce')
            except ValueError:
                print("Invalid date format encountered.")

        elif col_type == "int":
            try:
              pdf[col_name] = pd.to_numeric(pdf[col_name], errors='coerce').astype('Int64') # Use nullable int type
            except ValueError:
              print(f"Error converting {col_name} to int")
        else:
            pdf[col_name] = pdf[col_name].astype(col_type)
final_df_list.append(pdf)


combined_dfs = pd.concat(final_df_list)

# Set 'TT' as the index
combined_dfs = combined_dfs.set_index('TT')

# Rename columns
combined_dfs = combined_dfs.rename(columns={old_name: new_name for old_name, (_, new_name) in column_info.items() if old_name != 'TT'})

# Save to CSV



# Join with relative path
output_path = current_folder / "../src/assets/output.csv"

# Resolve the full absolute path (optional but useful)
output_path = output_path.resolve()

combined_dfs.to_csv(output_path, index_label='no', index= True)
